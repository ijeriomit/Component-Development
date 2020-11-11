<template>
    <div class="component-wrapper">
        <div class="search-bar">
            <input   v-if="!searchOnType" :placeholder='placeHolderText' type='text'  v-on:keyup="search(searchTerm)" v-model="searchTerm"/>
            <input  v-else type='text' :placeholder='placeHolderText' v-on:keyup.enter="search(searchTerm)" v-model="searchTerm"/>
            <font-awesome-icon class="search-button" @click="search(searchTerm)" title="click to search" :class="[searchButtonRight ? 'search-button-right' : 'search-button-left']" :icon="['fa', 'search']">
            </font-awesome-icon>
        </div>
        <ul v-if=" searchResults.length > 0 && enableResultList " class="search-results-wrapper">
            <li v-for="result in searchResults" :key="result.path+result.name" @click="searchResulClicked(result)">
                <div v-if="result.hasOwnProperty('name') && result.hasOwnProperty('path') " class="result-wrapper">
                    <!-- <div class="result-name">
                        {{result.name}}
                    </div>
                    <div class="result-path">
                        {{result.path}}
                    </div> -->
                </div>
                <div v-else  class="result-wrapper">
                    <!-- {{result}} -->
                </div>
            </li>
        </ul>
    </div>

</template>
<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'search-bar',
  props: {
    exampleSearchTerm: { type: String, required: true, default: function () { console.error('No example search term was given. Please pass in example in order to validate your search function'); return '' } },
    searchOnType: { type: Boolean, required: false, default: false },
    searchFunction: { type: Function, required: true, default: function () { console.error('No Search Function Was Defined'); return [] } },
    onSearchResultClick: { type: Function, required: true, default: function () { console.error('No Search Result Click Function  was defined') } },
    enableResultList: { type: Boolean, required: false, default: true },
    searchButtonRight: { type: Boolean, required: false, default: true },
    placeHolderText: { type: String, required: false, default: 'Type to search...' }
  },
  created: function () {
    library.add(faSearch)
  },
  data: function () {
    return {
      searchResults: [],
      searchTerm: ''
    }
  },
  watch: {
    $props: {
      immediate: true,
      handler: function () {
        if (!this.searchFunctionValidator()) {
          console.error('[Invalid Search Function]: function return value must be either, an Array of String values or an JSON with name and path keys')
        }
      }
    }
  },
  methods: {
    search: function () {
      this.searchResults = this.searchFunction(this.searchTerm)
    },
    searchResultClicked: function (result) {
      this.searchResults = []
      this.onSearchResultClicked(result)
    },
    searchFunctionValidator: function () {
      var results = this.searchFunction(this.exampleSearchTerm)
      var valid = false
      if (results instanceof Array) {
        if (results.every(i => (typeof i === 'string'))) {
          valid = true
          console.debug('Valid Search Function Returned Array of Strings ')
        } else if (results.every(i => (typeof i === 'object'))) {
          valid = true
          console.debug('[Valid Search Function], return array of JSON')
        }
      }
      return valid
    }
  },
  components: {
    FontAwesomeIcon
  }

}
</script>
<style lang="scss" scoped>
$defaultBackgroundColor: gray;
$defaultBorderRadius: 25px;
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
    /* width: fit-content; */
    cursor: pointer;
}
 .component-wrapper{
    display: flex;
    align-items: baseline;
    flex-flow: column;
    width: 300px;
    padding: 10px;
    justify-content: space-around;

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
    background-color: $defaultBackgroundColor;
    border-radius: $defaultBorderRadius;
    justify-content: space-between;
    align-items: center;
 }
 .search-bar input{
   border: none;
   background-color: inherit;
 }
 .search-bar input:focus{
   outline: none;
 }
 .result-wrapper{
     height: fit-content;
     display: flex;
     flex-direction: column;
     width: 100%;
    //  margin-top: 5px;
    //  margin-bottom: 5px;
    //  background-color: wheat;
    //  border-bottom: 2px solid black;
 }
 .search-results-wrapper{
    width: 100%;
    font-size: 12px;
    position: relative;
    // left: 0px;
    top: 5px;
    margin-top: 0px;
    margin-bottom: 0px;
    margin-inline-start: 0px;
    padding-inline-start: 0px;
    padding: inherit;
    order: 2;
    overflow: hidden;
    border-radius: $defaultBorderRadius;
    background-color: $defaultBackgroundColor;

 }
 .result-path{
     order: 3;
     overflow: hidden;
 }
 .result-name{
     order: 1;
     overflow: hidden;
     padding-bottom: 2px;
     padding-top: 2px;
 }

</style>
