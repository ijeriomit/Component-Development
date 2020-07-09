export default class FileTree {
  constructor (data, delimeter, sort = null) {
    var that = this
    this.tree = []
    this.delimiter = delimeter
    this.sort = sort
    console.log('Data:', data)
    data.map(function (path) {
      that.placeNodeInTree(path)
    })
  }

  initializeNode (name, isFolder, path) {
    return {
      name: name,
      isFolder: isFolder,
      sub_contents: [],
      expanded: false,
      path: path
    }
  }

  appendNode (name, target, path, isFolder) {
    var newNode = this.initializeNode(name, isFolder, path)
    const log = JSON.stringify(newNode)
    console.log('New Node: ', log)
    target.push(newNode)
    if (this.sort instanceof Function) {
      target.sort(this.sort)
    }
  }

  searchTree (path, searchList, action) {
    if (searchList != null) {
      if (path !== [] || searchList !== []) {
        for (var i = 0; i < searchList.length; i++) {
          if (searchList[i].name === path[0]) {
            if (action instanceof Function) {
              action(searchList, i)
            }
            if (path.length === 1) {
              return { targetList: searchList, index: i, found: true }
            } else {
              path.shift()
              return this.searchTree(
                path,
                searchList[i].sub_contents,
                action
              )
            }
          }
        }
      }
    }
    return { found: false, targetList: searchList, index: 0 }
  }

  placeNodeInTree (path) {
    var pathArray = path.split(this.delimiter)
    console.log('Path', pathArray)
    for (var i = 0; i < pathArray.length; i++) {
      var targetPath = pathArray.slice(0, i + 1)
      var searchResult = this.searchTree(targetPath, this.tree)
      const log = JSON.stringify(searchResult)
      console.log('TargetPath', targetPath, 'Search Result', log)
      if (!searchResult.found) {
        var nodeName = pathArray[i]
        var nodePath = pathArray.slice(0, i).join(this.delimiter)
        console.log('Appending Node', nodeName, nodePath)
        var isFolder = true
        if (i === pathArray.length - 1) {
          isFolder = false
        }
        this.appendNode(nodeName, searchResult.targetList, nodePath, isFolder)
      }
    }
  }

  removeNodeFromTree (path) {
    var pathArray = path.split(this.delimiter)
    var searchResult = this.searchTree(pathArray, this.tree)
    if (searchResult) {
      searchResult.targetList.splice(searchResult.index, 1)
    }
  }

  traverseTree (searchList, action, data, key) {
    if (searchList != null) {
      if (searchList.length !== 0) {
        for (var i = 0; i < searchList.length; i++) {
          data = this.traverseTree(
            searchList[i].sub_contents,
            action,
            data,
            key
          )
          data = action(searchList, i, data, key)
        }
        return data
      }
    }
    return data
  }
};
