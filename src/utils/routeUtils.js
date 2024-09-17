function listRoutes(layer, basePath = "") {
  if (layer.route) {
    const path = basePath + layer.route.path;
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`${methods} -> ${path}`);
  } else if (layer.name === 'router' && layer.handle.stack) {
    const newBasePath = basePath + (layer.regexp.source !== '^\\/?$' ? layer.regexp.source.replace('\\/?', '').replace('(?=\\/|$)', '') : '');
    layer.handle.stack.forEach((subLayer) => {
      listRoutes(subLayer, newBasePath);
    });
  }
}

function printRoutes(router) {
  console.log('Registered routes:');
  router.stack.forEach((layer) => {
    listRoutes(layer);
  });
}

module.exports = { printRoutes };
