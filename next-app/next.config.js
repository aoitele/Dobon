module.exports = {
    headers() {
      return [
        {
          // Matching all API routes
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: '*' },
            { key: "Vary", value: 'Origin' },
            { key: "Access-Control-Allow-Methods", value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          ]
        }
      ]
    }
  };