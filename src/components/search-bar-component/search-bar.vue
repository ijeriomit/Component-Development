
<template>
    <div class="component-wrapper">
        <div class="search-bar" :class="{shadow : inputFocused}">
            <input   v-if="!searchOnType" :placeholder='placeHolderText' type='text' v-on:focus="inputFocused = true" v-on:focusout="inputFocused = false" v-on:keyup="search(searchTerm)" v-model="searchTerm"/>
            <input  v-else type='text' :placeholder='placeHolderText' v-on:focus="inputFocused = true"  v-on:focusout="inputFocused = false" v-on:keyup.enter="search(searchTerm)" v-model="searchTerm"/>
            <font-awesome-icon v-if="searchResults.length === 0" class="search-button" @click="search(searchTerm)" title="click to search" :class="[buttonOrientationRight ? 'search-button-right' : 'search-button-left']" :icon="['fa', 'search']">
            </font-awesome-icon>
            <font-awesome-icon v-else class="search-button" @click="clearSearch()" title="click to clear" :class="[buttonOrientationRight ? 'search-button-right' : 'search-button-left']" :icon="['fa', 'times']"></font-awesome-icon>
        </div>
        <ul v-show=" showSearchResults && searchResults.length > 0" class="search-results-wrapper shadow">
              <li v-for="(result, index) in searchResults" :key="(result, index)" @click="searchResultClicked(result)" @mouseenter="select($event.target)" @mouseleave="unselect($event.target)">
                  <div v-if="result.hasOwnProperty('name') && result.hasOwnProperty('path') " class="result-wrapper">
                      <div class="result-name" :id="`result-name-${index}`">
                        <p>
                         Name: {{result.name.substring(0, result.name.indexOf(searchTerm))}}<b>{{result.name.substring(result.name.indexOf(searchTerm), result.name.indexOf(searchTerm) + searchTerm.length)}}</b>{{result.name.substring(result.name.indexOf(searchTerm) + searchTerm.length)}}
                        </p>
                      </div>
                      <div class="result-path" :id="`result-path-${index}`">
                         <p>
                         Path:  {{result.path.substring(0, result.path.indexOf(searchTerm))}}<b>{{result.path.substring(result.path.indexOf(searchTerm), result.path.indexOf(searchTerm) + searchTerm.length)}}</b>{{result.path.substring(result.path.indexOf(searchTerm) + searchTerm.length)}}
                        </p>
                      </div>
                  </div>
                  <div v-else  class="result-wrapper">
                      {{result}}
                  </div>
              </li>
        </ul>
    </div>

</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'search-bar',
  props: {
    exampleSearchTerm: {
      type: String,
      required: true,
      default: () => {
        console.error('[Search-Bar]: no value was given for "exampleSearchTerm" property. Default value set to: "". Search function cannot be validated or used')
        return ''
      }
    },
    searchOnType: {
      type: Boolean,
      required: false,
      default: () => {
        console.debug('[Search-Bar]: no value was given for "searchOnType" property. Default value set to: "false". Search bar will not search as you type')
        return false
      }
    },
    searchFunction: {
      type: Function,
      required: true,
      default: () => {
        console.warn('[Search-Bar]: no value was given for "searchFunction" property. Default value set to: "undefined". Search Function will not work ')
        return () => { console.error('No search Function') }
      }
    },
    onSearchResultClick: {
      type: Function,
      required: false,
      default: () => {
        console.warn('[Search-Bar]: no value was given for "onSearchResultClick" property. Default value set to: "undefined". Search Result will do nothing on click')
        return () => { console.debug('No search Result Click Function') }
      }
    },
    showSearchResults: {
      type: Boolean,
      required: false,
      default: () => {
        console.debug('[Search-Bar]: no value was given for "showSearchResults" property. Default value set to: "true". Component will show results list')
        return true
      }
    },
    buttonOrientationRight: {
      type: Boolean,
      required: false,
      default: () => {
        console.debug('[Search-Bar]: no value was given for "buttonOrientationRIght" property. Default value set to: "true". Search Button will be positioned on the right')
        return true
      }
    },
    placeHolderText: {
      type: String,
      required: false,
      default: () => {
        console.debug('[Search-Bar]: no value was given for "placeHolderText" property. Default value set to: "Type to search..."')
        return 'Type to search...'
      }
    },
    darkSearchResultTheme: {
      type: Boolean,
      required: false,
      default: () => {
        console.warn('[Search-Bar]: no value was given for "placeHolderText" property. Default value set to: "true". On hover search results will be a lighter color')
        return true
      }
    }
  },
  created: function () {
    library.add(faSearch, faTimes)
  },
  data: function () {
    return {
      searchResults: [],
      searchTerm: '',
      inputFocused: false,
      searchFunctionValid: false
    }
  },
  watch: {
    $props: {
      immediate: true,
      handler: function () {
        this.searchFunctionValidator()
      }
    }
  },
  methods: {
    select: function (element) {
      if (element instanceof HTMLLIElement === false) {
        return
      }
      if (this.darkSearchResultTheme) {
        element.style.backgroundColor = 'rgba(255, 255, 255, .25)'
      } else {
        element.style.backgroundColor = 'rgba(0, 0, 0, .25)'
      }
    },
    unselect: function (element) {
      if (element instanceof HTMLLIElement === false) {
        return
      }
      element.style.backgroundColor = 'inherit'
    },
    search: function () {
      if (this.searchTerm === '') {
        return
      }
      if (!this.searchFunctionValid) {
        console.error('[Search Bar]: Invalid Search Function.')
        return
      }
      this.searchResults = this.searchFunction(this.searchTerm)

      if (this.searchResults.length === 0) {
        this.searchResults.push('No Results')
      }
    },
    clearSearch: function () {
      this.searchResults = []
      this.searchTerm = ''
    },
    searchResultClicked: function (result) {
      this.onSearchResultClick(result)
      this.clearSearch()
    },
    searchFunctionValidator: function () {
      if (this.searchFunction instanceof Function === false) {
        console.error('[Search Bar]: Invalid Search Function. Function return value must be either, an Array of String values or a JSON with name and path keys')
        return
      }
      var results = this.searchFunction(this.exampleSearchTerm)
      if (results instanceof Array) {
        if (results.every(i => (typeof i === 'string'))) {
          this.searchFunctionValid = true
          console.debug('Valid Search Function Returned Array of Strings ')
        } else if (results.every(i => (typeof i === 'object'))) {
          this.searchFunctionValid = true
          console.debug('[Valid Search Function], return array of JSON')
        } else {
          console.error('[Search Bar]: Invalid Search Function. Function return value must be either, an Array of String values or a JSON with name and path keys')
          this.searchFunctionValid = false
        }
      }
    }
  },
  components: {
    'font-awesome-icon': FontAwesomeIcon
  }

}
</script>
<style lang="scss" scoped>
$defaultBorderRadius: 20px;
$defaultBoxShadow: 0px 10px 20px 0px rgba(200,200,200, .7);
$defaultBackgroundColor: rgb(198, 198, 198);
@import './scrollbar.scss';
input{
    width: 85%;
}
button{
    width: 15%;
}
.search-button{
  font-size: 16px;
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;
}
 .component-wrapper{
  display: flex;
  align-items: baseline;
  flex-flow: column;
  width: 300px;
  padding: 10px;
  justify-content: space-around;
  border-radius: $defaultBorderRadius;
  color: white;
  visibility: hidden;
  background-color: $defaultBackgroundColor;
 }

 .shadow{
  box-shadow: $defaultBoxShadow;
 }
 .search-button-right{
  order: 1;
 }
 .search-button-left{
  order: -1;
 }
 .search-bar{
  order: 1;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  width: 100%;
  padding: inherit;
  border-radius: inherit;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.25s ease-in-out;
  visibility: visible;
  background-color: inherit;
  color: inherit;

 }
 .search-bar input{
  border: none;
  background-color: inherit;
  color: inherit;
 }
 .search-bar input:focus{
  outline: none;
 }
 .result-wrapper{
  height: 20%;
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  cursor: pointer;
 }
 .result-wrapper p b{
   background-color: darkgray;
 }

 li:hover{
   background-color: rgba(0,0,0,.5);
 }

 li{
  cursor: pointer;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: #0000;
 }

 .search-results-wrapper{
    width: calc(100% + 20px);
    height: 150px;
    font-size: 12px;
    position: relative;
    margin-top: 5px;
    margin-bottom: 0px;
    margin-inline-start: 0px;
    padding-inline-start: 0px;
    padding: inherit;
    padding-left: 0px;
    padding-right: 0px;
    order: 2;
    overflow-y: scroll;
    border-radius: inherit;
    opacity: .8;
    transition: .25s ease-in-out;
    list-style-type: none;
    visibility: visible;
    background-color: inherit;
 }
 .result-path{
     order: 3;
     overflow: hidden;
     font-style: italic;
 }
 .result-name{
     order: 1;
     overflow: hidden;
     padding-bottom: 2px;
     padding-top: 2px;
 }

</style>
