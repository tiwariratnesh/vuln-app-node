const ejs = require('ejs');
const handlebars = require('handlebars');
const pug = require('pug');
const mustache = require('mustache');
const dot = require('dot');

function compileAndRender(template, engine, data) {
  switch (engine.toLowerCase()) {
    case 'ejs':
      return ejs.render(template, data);
    
    case 'handlebars':
      const hbsCompiled = handlebars.compile(template);
      return hbsCompiled(data);
    
    case 'pug':
      return pug.render(template, data);
    
    case 'mustache':
      return mustache.render(template, data);
    
    case 'dot':
      const dotCompiled = dot.template(template);
      return dotCompiled(data);
    
    default:
      throw new Error(`Unsupported template engine: ${engine}`);
  }
}

function registerHelper(engine, name, fn) {
  if (engine === 'handlebars') {
    handlebars.registerHelper(name, fn);
  }
}

function compileTemplate(template, engine) {
  switch (engine.toLowerCase()) {
    case 'handlebars':
      return handlebars.compile(template);
    
    case 'dot':
      return dot.template(template);
    
    default:
      return (data) => compileAndRender(template, engine, data);
  }
}

module.exports = {
  compileAndRender,
  registerHelper,
  compileTemplate
};

