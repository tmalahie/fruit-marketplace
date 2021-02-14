function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a == null || typeof a != "object" || b == null || typeof b != "object")
    return false;

  let keysA = Object.keys(a),
    keysB = Object.keys(b);

  if (keysA.length != keysB.length) {
    return false;
  }

  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
}
function matchFilters<K>(item: K, filters: Partial<K>): boolean {
  for (const key in filters) {
    if (filters[key] != item[key]) return false;
  }
  return true;
}

export default {
  deepEqual(a: any, b: any) {
    return deepEqual(a, b);
  },
  subKeys(obj: any, keys: string[]): any {
    let res = {};
    for (let key of keys) {
      if (key in obj) res[key] = obj[key];
    }
    return res;
  },
  // Converts an array of objects with to a dict with id as key
  // Exemple: mapById([{id:"x",name:"aaa"}, {id:"y",name:"bbb"}]) = {"x":{id:"x",name:"aaa"},"y":{id:"y",name:"bbb"}}
  mapById<T>(
    obj: T[],
    res: { [id: string]: T } = {},
    key: string = "id"
  ): { [id: string]: T } {
    for (const item of obj) {
      res[item[key]] = item;
    }
    return res;
  },
  removeKeysWithUndefinedValues(obj: any) {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => ({
        ...acc,
        ...(value !== undefined && { [key]: value }),
      }),
      {}
    );
  },
  // Return obj[key] if it exists, defaultVal() otherwise
  getOrCreate<K>(
    obj: { [id in string]: K },
    key: string,
    defaultVal: () => K
  ): K {
    let res = obj[key];
    if (res == null) {
      res = defaultVal();
      obj[key] = res;
    }
    return res;
  },
  // Return the first arr element thay matches the filters if it exists, defaultVal() otherwise
  findOrCreate<K, L>(
    arr: (K & L)[],
    filters: K,
    defaultVal: L,
    predicate: (item: K & L, filters: K) => boolean = matchFilters
  ): K & L {
    let res = arr.find((item) => predicate(item, filters));
    if (res) {
      return res;
    }
    res = {
      ...filters,
      ...defaultVal,
    };
    arr.push(res);
    return res;
  },
  shuffle<K>(a: K[]): K[] {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  isObject(a: any): boolean {
    return !!a && a.constructor === Object;
  },
  isObjectOrArray(a: any): boolean {
    return !!a && (a.constructor === Object || a.constructor === Array);
  },
  isEmpty(obj): boolean {
    return Object.keys(obj).length === 0;
  },
};
