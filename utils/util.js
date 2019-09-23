function templateStr(template, attributes) {
  for (var i in attributes) {
    if (attributes.hasOwnProperty(i)) {
      template = template.replace('{{ ' + i + ' }}', attributes[i]);
    }
  }
  return template;
}
