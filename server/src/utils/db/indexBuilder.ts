import dbTypes from "./types";

const addIndexes = indexesList => table => {
    if (!indexesList) return;
    indexesList.forEach((index) => {
        let res = index.unique ? table.unique(index.columns) : table.index(index.columns);
        if (index.name)
            res.name(index.name);
        return res;
    });
};

export default addIndexes;