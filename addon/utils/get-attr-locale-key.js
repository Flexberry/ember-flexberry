export default function getAttrLocaleKey(mainModelName, projectionName, bindingPath, nameRelationship) {
 if (nameRelationship) {
    bindingPath = `${nameRelationship}.${bindingPath}`;
 }

 return `models.${mainModelName}.projections.${projectionName}.${bindingPath}.__caption__`
}
