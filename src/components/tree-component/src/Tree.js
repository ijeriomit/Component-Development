export default class Tree {
  constructor (data, delimeter, sort = null) {
    var that = this
    this.treeObject = []
    this.delimiter = delimeter
    this.sort = sort
    data.map(function (path) {
      that.placeNodeInTree(path)
    })
  }

  initializeNode (name, isFolder, path) {
    console.log('Node: ', name, ' Path: ', path)
    return {
      name: name,
      isFolder: isFolder,
      contents: [],
      selected: false,
      expanded: false,
      path: path
    }
  }

  appendNode (name, target, path, isFolder) {
    var newNode = this.initializeNode(name, isFolder, path)
    target.push(newNode)
    if (this.sort instanceof Function) {
      target.sort(this.sort)
    }
  }

  removeNode (path) {
    var pathStack = path.split('/')
    var searchResult = this.searchTree(pathStack, this.treeObject)
    if (searchResult.found) {
      searchResult.targetList.splice(searchResult.index, 1)
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
                searchList[i].contents,
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
    // console.log('Path', pathArray)
    for (var i = 0; i < pathArray.length; i++) {
      var targetPath = pathArray.slice(0, i + 1)
      var searchResult = this.searchTree(targetPath, this.treeObject)
      if (!searchResult.found) {
        var nodeName = pathArray[i]
        var nodePath = '/' + pathArray.slice(0, i).join(this.delimiter) + '/' + nodeName
        if (i === 0) {
          nodePath = '/' + nodeName
        }
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
    var searchResult = this.searchTree(pathArray, this.treeObject)
    if (searchResult) {
      searchResult.targetList.splice(searchResult.index, 1)
    }
  }

  traverseTree (searchList, action, data, key) {
    if (searchList != null) {
      if (searchList.length !== 0) {
        for (var i = 0; i < searchList.length; i++) {
          data = this.traverseTree(
            searchList[i].contents,
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
