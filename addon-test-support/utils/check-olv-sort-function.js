let getHeaderSort = function(olv, index, helpers) {
  const headCells = helpers.find('thead .dt-head-left', olv).toArray();
  const headCell = headCells[index];
  const sort = helpers.find('.object-list-view-order-icon', headCell);
  const sortValue = sort.text().trim();
  const sortIndex = parseInt(sortValue.slice(1));

  return {
    index: sortIndex,
    icon: sortValue.slice(0, 1)
  };
};

export {
  getHeaderSort
};
