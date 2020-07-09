<template lang="pug">
  div(class="default-theme")
    div(style='height:inherit;')
      div(class="search-bar-wrapper")
        input(class="search-bar" type='text' placeholder='Type to search...' v-on:keyup.enter='searchFiles(searchKey)' @focus='focused($event)' v-model='searchKey')
        button(class="search-button" v-on:click='searchFiles(searchKey)')
          i(class="fas fa-search")
      ul(class="search-result-list-wrapper" :class='{ hidden: !showSearchResults }')
        li(class="search-list-item" v-for='result in searchResults' :key='result.path')
          div(v-on:click='searchResultClicked(result)')
            div(class="search-result-content-wrapper")
              div(class="search-result-item-title")
                i(:class="[result.is_folder ? 'fas fa-folder': 'fas fa-video', 'order-1']")
                div(class="order-2")
                  | {{ displayName(result.name, result.path) }}
                div( class ="search-result-delete-icon" v-if='canDelete && !result.is_folder'
                  data-toggle='modal' data-target='#deleteVideoModal' v-on:click='sendVideoToDeleteModal(result)')
                  i(class="far fa-trash-alt")
                div(class="order-3" v-else)
              span(class="search-result-file-path")
                | {{ displayPath(result.path) }}
              
      ul(class="file-tree-wrapper" :class='{ hidden: showSearchResults }')
        li(class="file-tree-parent-folder" v-for='node in videoFileTree' :key='node.name' :class='{ expanded: node.expanded }')
          div(class="file-tree-icon-content-wrapper" v-on:click='folderClicked(node)')
            i(v-if='node.is_folder' :class="[\
            node.expanded ? 'far fa-folder-open ic-w mx-1' : 'fas fa-folder'\
            , 'file-tree-icon-left']")
            div(class="file-tree-content-title")
              | {{ displayName(node.name, node.path) }}
          ul(class="folder" :class='{ expanded: node.expanded }')
            li(v-for='child_node in node.sub_contents' :key='child_node.path')
              div(class="file-tree-content-wrapper")
                div(class="side-branch-icon")
                div(class="file-tree-icon-content-wrapper" :class='{\
                  selected:\
                  currentFilePath == child_node.path &&\
                  !child_node.is_folder}' v-on:click='itemClicked(child_node)')
                  i(v-if='child_node.is_folder' :class="[\
                  child_node.expanded\
                  ? 'far fa-folder-open ic-w mx-1'\
                  : 'fas fa-folder'\
                  ,'file-tree-icon-left']" )
                  i(class="fas fa-video file-tree-icon-left" v-else)
                  i(class="file-tree-info-icon fas fa-info-circle" v-if="\
                  child_node.path.includes('events') &&\
                  !child_node.is_folder\
                  " v-on:click='infoButtonClicked(child_node)')
                  div(class="file-tree-content-title")
                    | {{ displayName(child_node.name, child_node.path) }}
                  i(class="tree-content-delete-icon far fa-trash-alt" v-if='canDelete && !child_node.is_folder' :class='{ hidden: !node.expanded }' data-toggle='modal' data-target='#deleteVideoModal' v-on:click='sendVideoToDeleteModal(child_node)')
              ul(class="sub-folder" :class='{ expanded: child_node.expanded }')
                li(v-for='grandchild_node in child_node.sub_contents' :key='grandchild_node.path')
                  div(class="file-tree-content-wrapper")
                    div(:class="[grandchild_node.path.includes('events') ? 'side-branch-icon-tall' : 'side-branch-icon']")
                    div(class="file-tree-icon-content-wrapper" v-if='!grandchild_node.is_folder' v-on:click='fileClicked(grandchild_node)' :class='{\
                      selected: currentFilePath == grandchild_node.path\
                      }')
                      i(class="fas fa-video file-tree-icon-left")
                      i(class="file-tree-info-icon fas fa-info-circle"  v-if="\
                      grandchild_node.path.includes('events') &&\
                      !grandchild_node.is_folder\
                      " v-on:click='infoButtonClicked(grandchild_node)')
                      div(class="file-tree-content-title")
                        | {{ displayName(grandchild_node.name, grandchild_node.path) }}
                      i(class="tree-content-delete-icon far fa-trash-alt"  v-if='canDelete' :class='{ hidden: !child_node.expanded }' data-toggle='modal' data-target='#deleteVideoModal' v-on:click='sendVideoToDeleteModal(grandchild_node)')
                      
</template>

<script>
import appStore from "@/store/app";
import TimeHelper from "@/models/TimeHelper";

export default {
  name: "tree-dir",
  data: function() {
    return {
      videoFileTree: [
        {
          name: "archives",
          is_folder: true,
          path: "archives",
          sub_contents: [],
          expanded: true
        },
        {
          name: "events",
          is_folder: true,
          path: "events",
          sub_contents: [],
          expanded: true
        }
      ],
      appStoreState: appStore.state,
      searchKey: "",
      searchResults: [],
      currentFilePath: "",
      showSearchResults: false,
      folderDepth: 2
    };
  },
  methods: {
    focused: function(event) {
      this.$emit("input-focused", event);
    },
    /**
     * function that navigates the user to the search result that they clicked
     * @param {Object} result the search result that was clicked from the search result list
     */
    searchResultClicked: function(result) {
      this.showSearchResults = false;
      this.traverseTree(this.videoFileTree, this.collapseFolder);
      var fullpath = result.path.split("/");
      var pathStack = fullpath.splice(0, fullpath.length - 1);
      this.searchTree(pathStack, this.videoFileTree, this.expandFolder);
      if (!result.is_folder) {
        this.fileClicked(result);
      }
    },
    /**
     * action for when a file or folder is clicked in the tree
     * @param {Object} item the item that was clicked
     */
    itemClicked: function(item) {
      if (item.is_folder) {
        this.folderClicked(item);
      } else {
        this.fileClicked(item);
      }
    },
    /**
     * sends data to parent component about which file was clicked
     * @param {Object} file the item that was clicked
     */
    fileClicked: function(file) {
      this.currentFilePath = file.path;
      this.$emit("selected-file", file.name, file.path, file.sub_contents);
    },
    /**
     * tells parent component which file was chosen to be deleted
     * @param {Object} file that was clicked for deletion
     */
    sendVideoToDeleteModal: function(file) {
      this.$emit("selected-file-to-delete", file.path);
    },
    /**
     * sends message to parent component that info button was clicked for a file
     * @param {DOMElement} element html element that recieved the click
     * @param {Object} file file node whose info was requested
     */
    infoButtonClicked: function(file) {
      this.$emit("info-popup", file.path);
    },
    /**
     * expands the folder that was clicked on
     * @param {Object} folder folder node from file tree that was clickedF
     */
    folderClicked: function(folder) {
      folder.expanded = !folder.expanded;
    },

    /**
     * search all files in filetree and return results that contain the search key
     * @param {String} searchKey value to search for in tree
     */
    searchFiles: function(searchKey) {
      if (searchKey.length != 0) {
        this.searchResults = this.traverseTree(
          this.videoFileTree,
          this.searchCheck,
          [],
          searchKey
        );
        if (this.searchResults.length != 0) {
          this.showSearchResults = true;
        } else {
          this.showSearchResults = false;
        }
        this.searchKey = "";
      }
    },
    /**
     * function to be passed into either searchTree or traverseTree
     * sets folders expanded parameter to false
     * @param folderList list of folders
     * @param index index of item in folder list
     */
    collapseFolder: function(folderList, index) {
      folderList[index].expanded = false;
    },
    /**
     * function to be passed into either searchTree or traverseTree
     * sets folders expanded parameter to true
     * @param folderList list of folders
     * @param index index of item in folder list
     */
    expandFolder: function(folderList, index) {
      folderList[index].expanded = true;
    },
    /**
     * function to be passed into traverse tree
     * Checks if nodes in filetree contain the search key in their name
     * and returns the hits
     * @param targetList List of nodes
     * @param itemIndex index of target in target list
     * @param hits an array of hits that match our search
     * @param searchKey key to compare targets to
     */
    searchCheck: function(targetList, itemIndex, hits, searchKey) {
      var item = targetList[itemIndex];
      if (
        this.displayName(item.name, item.path)
          .toLowerCase()
          .includes(searchKey.toLowerCase()) &&
        !item.name.includes("ORB_") &&
        !item.name.includes("ALL")
      ) {
        hits.push(item);
      }
      return hits;
    },
    /**
     * depth first traversal of tree
     * @param searchlist list of nodes to search through
     * @param action function to be performed with every node hit in traversal
     * @param data data returned from action function
     * @param key a key (Ex. searchkey)
     */
    traverseTree: function(searchlist, action, data, key) {
      if (searchlist != null) {
        if (searchlist.length !== 0) {
          for (var i = 0; i < searchlist.length; i++) {
            data = this.traverseTree(
              searchlist[i].sub_contents,
              action,
              data,
              key
            );
            data = action(searchlist, i, data, key, searchlist);
          }
          return data;
        }
      }
      return data;
    },
    /**
     * expands all folders along a given path
     * @param {Array} path array of strings giving the path to the object
     * @param {Array} searchlist array to search in
     */

    searchTree: function(path, searchlist, action) {
      if (searchlist != null) {
        if (path.length !== 0 || searchlist.length !== 0) {
          for (var i = 0; i < searchlist.length; i++) {
            if (searchlist[i].name == path[0]) {
              if (action) {
                action(searchlist, i);
              }
              if (path.length == 1) {
                return { targetList: searchlist, index: i, found: true };
              } else {
                path.shift();

                return this.searchTree(
                  path,
                  searchlist[i].sub_contents,
                  action
                );
              }
            }
          }
        }
      }

      return { found: false, targetList: searchlist };
    },
    /**
     * function that will add data to the node of the tree
     * @param {Array} name name of the new node
     * @param {Array} node the node in the tree that will have its data updated
     * @param {String} path file path of the node
     * @param {Bool} is_folder boolean of whether the node is a file or folder
     */

    push_node: function(name, targetList, path, is_folder) {
      //save path to file
      var that = this;
      var newNode = that.initializeNode(name, is_folder, path);
      targetList.push(newNode);
      targetList.sort(function(a, b) {
        return TimeHelper.sortDateDescTimeDesc(
          that.extractDateandTime(a.name),
          that.extractDateandTime(b.name)
        );
      });
    },
    /**
     * function that will add a node in to the tree
     * @param {Array} fullpath the relative path of the file split on slashes used like a stack LIFO
     */
    addNode: function(path) {
      path = path.split("/");
      var isFolder = true;
      for (var i = 0; i < path.length; i++) {
        if (i >= this.folderDepth) {
          isFolder = false;
        }
        let targetName = path[i];
        let targetPath = path.slice(0, i + 1);
        let searchResult = this.searchTree(targetPath, this.videoFileTree);
        if (!searchResult.found) {
          targetPath = path.slice(0, i + 1).join("/");
          this.push_node(
            targetName,
            searchResult.targetList,
            targetPath,
            isFolder
          );
        }
      }
    },
    /**
     * intializes nodes for the file tree
     * @param {string} name name of the new node
     * @param {boolean} is_folder whether node is a folder or not
     * @param {string} path the file path to node
     */
    initializeNode: function(name, is_folder, path) {
      return {
        name: name,
        is_folder: is_folder,
        sub_contents: [],
        expanded: false,
        path: path
      };
    },
    /**
     * traverses entire tree when an item gets deleted and removes empty folders
     */
    purgeEmptyFolders: function() {
      this.traverseTree(this.videoFileTree, this.deleteEmptyFolder);
    },
    /**
     * Function to be passed into Traverse tree
     * checks if a folder is empty or not and removes it if it is
     * @param {Array} targetList list which node gets removed from if empty
     * @param {int} index index of our node of interest in target list
     */
    deleteEmptyFolder: function(targetList, index) {
      let targetNode = targetList[index];
      if (targetNode.path != ("archives" || "events")) {
        if (
          !targetNode.path.includes(".mp4") &&
          targetNode.sub_contents.length == 0
        ) {
          targetList.splice(index, 1);
        }
      }
    },
    /**
     * removes a node from the file tree
     * @param {Array} pathStack path to node that needs removing
     */
    remove_node: function(path) {
      var pathStack = path.split("/");
      let searchResult = this.searchTree(pathStack, this.videoFileTree);
      if (searchResult.found) {
        searchResult.targetList.splice(searchResult.index, 1);
      }
    },
    /**
     * formating of the path to the file
     * @param {String} path the path to the file
     */
    displayPath: function(path) {
      return (
        "..." +
        path
          .split("/")
          .slice(0, path.split("/").length - 1)
          .join("/")
      );
    },
    /**
     * Formats and returns a name to display to the user
     * @param {String} name name of the file or folder
     * @param {String} path path to the file or folder
     */
    displayName: function(name, path) {
      var prefix = "";
      var newtitle = "";
      var date = "";
      var time = "";
      if (path.includes("archives")) {
        prefix = "archive_";
      } else if (path.includes("events")) {
        prefix = "mergedEvent_";
      }
      if (/\d{4}-\d{2}-\d{2}/.test(name)) {
        date = /\d{4}-\d{2}-\d{2}/.exec(name);
        date = date.toString();
      }
      if (/_\d{2}-\d{2}-\d{2}/.test(name)) {
        time = /_\d{2}-\d{2}-\d{2}/.exec(name);
        time = time
          .toString()
          .replace("-", ":")
          .replace("-", ":");
      }
      newtitle = date != "" && time != "" ? prefix + date + time : name;
      return newtitle;
    },
    /**
     * Takes the YYYYMMDD-HMS part of file name converts it to a Date object
     * @param {String} filename name of file
     */
    extractDateandTime: function(filename) {
      let date = "";
      let time = "";
      if (/\d{4}-\d{2}-\d{2}/.test(filename)) {
        date = /\d{4}-\d{2}-\d{2}/
          .exec(filename)
          .toString()
          .replace("-", "")
          .replace("-", "");
        date = this.splitDate(date);
      }

      if (/_\d{2}-\d{2}-\d{2}/.test(filename)) {
        time = /_\d{2}-\d{2}-\d{2}/
          .exec(filename)
          .toString()
          .replace("_", "")
          .replace("-", "")
          .replace("-", "");
        time = this.splitTime(time);
      }
      if (time != "" && date != "") {
        return new Date(
          date.year,
          date.mon,
          date.day,
          time.hour,
          time.min,
          time.sec
        );
      } else if (date != "") {
        return new Date(date.year, date.mon, date.day);
      } else {
        return filename;
      }
    },
    /**
     * Splits the date into Year Month and Dat
     * @param {String} date date part of file name
     */
    splitDate: function(date) {
      var y = "",
        m = "",
        d = "";
      for (var i = 0; i < 4; i++) {
        y += date[i];
      }
      for (var j = 4; j < 6; j++) {
        m += date[j];
      }
      for (var k = 6; k < 8; k++) {
        d += date[k];
      }
      return { year: y, mon: m, day: d };
    },
    /**
     * Splits the date into Hour Min and Sec
     * @param {String} time time part of file name
     */
    splitTime: function(time) {
      var h = "",
        m = "",
        s = "";
      for (var i = 0; i < 2; i++) {
        h += time[i];
      }
      for (var j = 2; j < 4; j++) {
        m += time[j];
      }
      for (var k = 4; k < 6; k++) {
        s += time[k];
      }
      return { hour: h, min: m, sec: s };
    }
  },
  mounted: function() {
    var that = this;
    this.videos.map(function(path) {
      that.addNode(path);
    });
  },
  watch: {
    videos: function(val, oldVal) {
      let that = this;
      let removed = oldVal.filter(function(str) {
        return val.indexOf(str) < 0;
      });
      let added = val.filter(function(str) {
        return oldVal.indexOf(str) < 0;
      });
      added.map(function(path) {
        that.addNode(path);
      });
      removed.map(function(path) {
        that.remove_node(path);
      });
      if (removed.length > 0) {
        //checks if file was removed
        that.purgeEmptyFolders();
      }
    }
  },
  computed: {
    videos: function() {
      return this.appStoreState.rosModel.videoService.directory_info;
    },
    fileSystemMonitorCommandClient: function() {
      return this.appStoreState.rosModel.fileSystemMonitorCommandClient;
    },
    canDelete: function() {
      var authenticatedUserData =
        this.appStoreState.authenticatedUserData || {};
      var permissions = authenticatedUserData.permissions || {};
      var playback = permissions.playback || {};
      return playback.allowed_delete || false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/_variables.scss";

$icon-font-size: 20px;
.default-theme {
  // background-color: #101010;
  color: white;
  height: 100%;
  width: 100%;
  font-size: larger;
}
.file-tree-parent-folder {
  height: auto;
  position: relative;
  top: 10px;
  overflow: hidden;
  padding-bottom: 30px;
}
.expanded.folder {
  //this class applies to sub folders as well
  height: fit-content;
  top: 5px;
  position: relative;
}
.folder {
  transition: all 0.3s ease-in-out;
  height: 0px;
  overflow: hidden;
  padding-inline-start: 4%;
}
.sub-folder {
  @extend .folder;
  padding-inline-start: 9%;
}
.file-tree-parent-folder.expanded {
  height: fit-content;
}
li {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 0;
  list-style: none;
  height: auto;
  padding-top: 5px;
  padding-bottom: 5px;
}
i {
  line-height: 0;
  cursor: pointer;
  padding-left: 2px;
  padding-right: 8px;
}

.hidden {
  display: none;
}

.search-bar-wrapper {
  position: relative;
  top: 15px;
}
.search-bar {
  border: 2px solid #444;
  position: relative;
  left: 10px;
  width: 75%;
  height: 45px;
  padding: 10px;
  background-color: $siteBackground;
  color: $whiteColor;
}
.search-button {
  position: relative;
  left: 10px;
  height: 45px;
  border: 2px solid #444;
  border-left-width: 0px;
}
.search-list-item {
  padding-left: 0;
  list-style: none;
  padding: top;
  padding-top: 5px;
  padding-bottom: 5px;
}
.search-result-content-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 99%;
}
.search-result-item-title {
  order: 1;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}
.search-result-list-wrapper {
  top: 35px;
  position: relative;
  overflow-y: scroll;
  height: inherit;
}
.search-result-file-path {
  order: 2;
  font-size: medium;
  font-style: italic;
  text-align: center;
  // left: 55%;
  // position: absolute;
}
.search-result-delete-icon {
  order: 3;
  cursor: pointer;
  color: $whiteColor;
  font-size: 20px;
  height: 100%;
  width: 26px;
}
.file-tree-wrapper {
  padding-left: 5px;
  overflow-y: scroll;
  top: 30px;
  position: relative;
  height: inherit;
}
.file-tree-icon-content-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  order: 2;
  padding-left: 4px;
  top: 4px;
  position: relative;
  border-radius: 15px;
  cursor: pointer;
}

.file-tree-icon-left {
  order: 1;
  padding-right: 3px;
}
.file-tree-info-icon {
  // @extend .file-tree-icon-content-wrapper;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: $icon-font-size;
  padding-left: 4px;
  order: 2;
}
.file-tree-content-title {
  order: 3;
  // max-width: 70%;
  padding-right: 3px;
  padding-left: 3px;
}
.file-tree-icon-right {
  order: 3;
  padding-left: 3px;
}

.file-tree-icon-content-wrapper.selected {
  background-color: #f6a504;
}

.file-tree-content-wrapper {
  display: flex;
  flex-direction: row;
  /* justify-content: end; */
  justify-content: flex-start;
  flex-flow: nowrap;
}

.tree-content-delete-icon {
  order: 4;
  padding-left: 10px;
  color: $whiteColor;
  font-size: 20px;
  cursor: pointer;
}
.tree-content-delete-icon.hidden {
  display: none;
}
.file-tree-parent-folder {
  height: auto;
  position: relative;
  top: 10px;
  overflow: hidden;
  padding-bottom: 30px;
}
.file-tree-parent-folder.expanded {
  height: fit-content;
}

.side-branch-icon {
  height: 20px;
  width: 20px;
  border-bottom: 2px solid white;
  border-left: 2px solid white;
  order: 1;
}
.side-branch-icon-tall {
  @extend .side-branch-icon;
  height: 33px;
}

.order-1 {
  order: 1;
}
.order-2 {
  order: 2;
}
.order-3 {
  order: 3;
}
.order-4 {
  order: 4;
}
</style>
