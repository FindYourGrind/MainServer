<template>
  <div id="logger" width="350">

    <div class="admin-logger-header-panel-wrapper" align="center">
      <div class="admin-logger-header-panel">
        <h2>Logger</h2>
      </div>
    </div>

    <div class="admin-logger-left-panel-wrapper">
      <div class="admin-logger-left-panel">
        HelloWorld!
      </div>
    </div>

    <div class="admin-logger-right-panel-wrapper">
      <!--<table>-->
        <!--<thead>-->
          <!--<tr>-->
            <!--<th v-for="column in columns">-->
              <!--{{ column }}-->
            <!--</th>-->
          <!--</tr>-->
        <!--</thead>-->
        <!--<tbody>-->
          <!--<tr v-for="record in logFlow">-->
            <!--<td v-for="column in columns">-->
              <!--{{ record[column] }}-->
            <!--</td>-->
          <!--</tr>-->
        <!--</tbody>-->
      <!--</table>-->

      <!--<b-table class="table-fixed" width="75%" striped hover :items="logFlow" :fields="columns"></b-table>-->

      <b-list-group>
        <b-list-group-item class="log-item" v-for="record in logFlow" :key="record.id">
          {{ record }}
        </b-list-group-item>
      </b-list-group>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'logger',
    data: function () {
      return {
        logCount: 0,
        logFlow: [],
        //columns: ['action','clientId','payload', 'timeStamp'],
        columns: {
          action: {
            label: 'action',
            sortable: true
          },
          clientId: {
            label: 'clientId',
              sortable: true
          },
          payload: {
            label: 'payload'
          },
          timeStamp: {
            label: 'timeStamp'
          }
        },
        options: {
          filterable: false,
          pagination: {}
        }
      }
    },
    methods: {
      createIdForCollapse: function (id) {
        return 'admin-log-collapse-' + id;
      },
      onLogListItemClick: function (id) {
        this.$emit("collapse::toggle", this.createIdForCollapse(id));
      }
    },
    socket: {
      events: {
        logger(msg) {
          let logObject = JSON.parse(msg);
          logObject.id = this.logCount++;
          this.logFlow.push(logObject);
          //var elem = document.getElementById('admin-logger-right-panel');
          //elem.scrollTop = elem.scrollHeight;
        }
      }
    }
  }
</script>

<style>
  #logger {
    width: 100%;
    overflow-x: auto;
  }

  .admin-logger-header-panel-wrapper {

  }

  .admin-logger-header-panel-wrapper .admin-logger-header-panel {
    background-color: #6a9dff;
    border-radius: 6px;
    width: 99%;
    height: 35px;
  }

  .admin-logger-left-panel-wrapper {
    display: inline-block;
    float: left;
    width: 400px;
  }

  .admin-logger-left-panel-wrapper .admin-logger-left-panel {
    margin: 5px 5px 5px 15px;
    background-color: aquamarine;
    border-radius: 6px;
    height: 500px;
  }

  .admin-logger-right-panel-wrapper {
    float: left;
    width: auto;
    height: 500px;
    overflow: auto;
    margin: 5px;
  }

  .log-item {
    font-size: 13px;
    height: 20px;
    margin: 5px;
    border-radius: 5px;
  }

  .log-item.list-group-item {
    padding: 0;
    background-color: rgba(76, 174, 76, 0.09);
  }
  /*.admin-logger-right-panel-wrapper thead {*/
    /*width: inherit;*/
    /*display: table;*/
  /*}*/

  /*.admin-logger-right-panel-wrapper tbody {*/
    /*height: 500px;*/
    /*overflow-y: auto;*/
  /*}*/

  /*.admin-logger-right-panel-wrapper thead tr {*/
    /*display: table;*/
    /*width: 75%;*/
  /*}*/

  /*.admin-logger-right-panel-wrapper thead tr > th {*/
    /*display:table-cell;*/
    /*min-width:100px;*/
  /*}*/

  /*.admin-logger-right-panel-wrapper tbody {*/
    /*height: 500px;       !* Just for the demo          *!*/
    /*overflow-y: auto;    !* Trigger vertical scroll    *!*/
    /*overflow-x: hidden;  !* Hide the horizontal scroll *!*/
  /*}*/
  /*.table-fixed thead {*/

  /*}*/
  /*.table-fixed tbody {*/
    /*height: 230px;*/
    /*overflow-y: auto;*/

  /*}*/
  /*.table-fixed thead, .table-fixed tbody, .table-fixed tr, .table-fixed td, .table-fixed th {*/
    /*display: block;*/
  /*}*/
  /*.table-fixed tbody td, .table-fixed thead > tr> th {*/
    /*float: left;*/
    /*border-bottom-width: 0;*/
  /*}*/

</style>
