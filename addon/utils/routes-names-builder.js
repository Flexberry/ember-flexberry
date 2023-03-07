export default function getNewRouteNameOfEditForm(routeName) {
    const postfix = '.new';

    return `${routeName}${postfix}`;
}
