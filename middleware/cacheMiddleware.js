/**
 * Cache Middleware
 * Adds lastUpdated timestamp and ETag support to API responses
 * Supports If-None-Match header for 304 Not Modified responses
 */

/**
 * Middleware to add lastUpdated timestamp to response
 * Uses the most recent updatedAt timestamp from the data
 */
const addCacheHeaders = (req, res, next) => {
  // Store original json method
  const originalJson = res.json.bind(res);

  // Override json method to add cache headers
  res.json = function (data) {
    // Calculate lastUpdated from data
    let lastUpdated = null;

    if (data) {
      // If data has success and data properties
      if (data.success && data.data) {
        const items = Array.isArray(data.data) ? data.data : [data.data];
        // Find the most recent updatedAt timestamp
        const timestamps = items
          .map((item) => item.updatedAt || item.createdAt)
          .filter(Boolean)
          .map((ts) => new Date(ts).getTime());

        if (timestamps.length > 0) {
          lastUpdated = new Date(Math.max(...timestamps)).toISOString();
        }
      } else if (Array.isArray(data)) {
        // If data is directly an array
        const timestamps = data
          .map((item) => item.updatedAt || item.createdAt)
          .filter(Boolean)
          .map((ts) => new Date(ts).getTime());

        if (timestamps.length > 0) {
          lastUpdated = new Date(Math.max(...timestamps)).toISOString();
        }
      } else if (data.updatedAt || data.createdAt) {
        // If data is a single object
        lastUpdated = (data.updatedAt || data.createdAt).toISOString();
      }
    }

    // If no timestamp found, use current time
    if (!lastUpdated) {
      lastUpdated = new Date().toISOString();
    }

    // Generate ETag from lastUpdated (simple hash)
    const etag = `"${Buffer.from(lastUpdated).toString('base64').slice(0, 16)}"`;

    // Check If-None-Match header for ETag validation
    const clientEtag = req.headers['if-none-match'];
    if (clientEtag && clientEtag === etag) {
      // Data hasn't changed, return 304 Not Modified
      return res.status(304).end();
    }

    // Add cache headers
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', lastUpdated);
    res.setHeader('Cache-Control', 'no-cache'); // Client must revalidate

    // Add lastUpdated to response body
    if (data && typeof data === 'object') {
      if (data.success && data.data) {
        data.lastUpdated = lastUpdated;
      } else if (Array.isArray(data)) {
        // Wrap array response
        return originalJson({
          data: data,
          lastUpdated: lastUpdated,
        });
      } else {
        data.lastUpdated = lastUpdated;
      }
    }

    return originalJson(data);
  };

  next();
};

/**
 * Middleware for meta endpoints - only returns lastUpdated
 */
const metaResponse = async (req, res, next) => {
  try {
    // This will be handled by the controller
    // Controllers should call res.metaResponse(lastUpdated)
    res.metaResponse = (lastUpdated) => {
      const etag = `"${Buffer.from(lastUpdated).toString('base64').slice(0, 16)}"`;
      const clientEtag = req.headers['if-none-match'];
      
      if (clientEtag && clientEtag === etag) {
        return res.status(304).end();
      }

      res.setHeader('ETag', etag);
      res.setHeader('Last-Modified', lastUpdated);
      res.setHeader('Cache-Control', 'no-cache');
      
      return res.json({
        lastUpdated: lastUpdated,
      });
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCacheHeaders,
  metaResponse,
};

