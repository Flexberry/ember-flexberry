export default function getAttrLocaleKey(mainModelName, projectionName, bindingPath, nameRelationship) {
  let newBindingPath = bindingPath;
  if (nameRelationship) {
    newBindingPath = `${nameRelationship}.${bindingPath}`;
  }

  return `models.${mainModelName}.projections.${projectionName}.${newBindingPath}.__caption__`;
}
