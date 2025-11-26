// utils/cloudinary.js
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const dotenv = require("dotenv");

dotenv.config();

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const DEFAULT_FOLDER = "uploads";
const SIX_MB = 6 * 1024 * 1024;

const detectResourceType = (mimetype) => {
    if (!mimetype) return "auto";
    if (mimetype.startsWith("image/")) return "image";
    if (mimetype.startsWith("video/")) return "video";
    return "auto";
};

const streamUpload = (buffer, options) =>
    new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });

const isRemoteUrl = (value = "") => /^https?:\/\//i.test(value);

const normalizeInput = (input) => {
    if (!input) return null;

    if (Buffer.isBuffer(input)) {
        return { type: "buffer", value: input };
    }

    if (typeof input === "string") {
        const trimmed = input.trim();
        const dataUriMatch = trimmed.match(/^data:(.+);base64,(.*)$/i);
        if (dataUriMatch) {
            return {
                type: "buffer",
                value: Buffer.from(dataUriMatch[2], "base64"),
                mimetype: dataUriMatch[1],
            };
        }
        if (isRemoteUrl(trimmed)) {
            return { type: "url", value: trimmed };
        }
        return { type: "literal", value: trimmed };
    }

    if (typeof input === "object" && input.buffer) {
        return {
            type: "buffer",
            value: input.buffer,
            mimetype: input.mimetype || input.type,
        };
    }

    return null;
};

const buildUploadOptions = (normalizedInput, overrides = {}) => {
    const resourceType =
        overrides.resourceType ||
        detectResourceType(normalizedInput?.mimetype);

    return {
        resource_type: resourceType,
        folder: overrides.folder || DEFAULT_FOLDER,
        chunk_size: overrides.chunkSize,
        public_id: overrides.publicId,
        overwrite: overrides.overwrite,
        eager: overrides.eager,
    };
};

const uploadAsset = async (input, overrides = {}) => {
    const normalized = normalizeInput(input);
    if (!normalized) {
        throw new Error("No file provided");
    }

    const options = buildUploadOptions(normalized, overrides);

    if (normalized.type === "literal") {
        return normalized.value;
    }

    if (normalized.type === "buffer") {
        return streamUpload(normalized.value, options);
    }

    const response = await cloudinary.uploader.upload(normalized.value, options);
    return response.secure_url;
};

const uploadImage = (input, overrides = {}) =>
    uploadAsset(input, {
        ...overrides,
        resourceType: "image",
        folder: overrides.folder || `${DEFAULT_FOLDER}/images`,
    });

const uploadVideo = (input, overrides = {}) =>
    uploadAsset(input, {
        ...overrides,
        resourceType: "video",
        chunkSize: overrides.chunkSize || SIX_MB,
        folder: overrides.folder || `${DEFAULT_FOLDER}/videos`,
    });

const uploadFile = (file, folder = DEFAULT_FOLDER) =>
    uploadAsset(file, { folder });

const uploadMultipleFiles = async (files = [], overrides = {}) =>
    Promise.all(files.map((file) => uploadAsset(file, overrides)));

module.exports = {
    uploadAsset,
    uploadImage,
    uploadVideo,
    uploadFile,
    uploadMultipleFiles,
};
