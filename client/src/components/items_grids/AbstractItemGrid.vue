<template>
    <md-table-card class="core-table-root">
        <md-table>
            <md-table-header>
                <md-table-row>
                    <md-table-head v-for="(column, columnIndex) in columns"
                                   :key="columnIndex"
                                   class="core-table-header-cell">
                        {{ column.name }}
                    </md-table-head>
                </md-table-row>
            </md-table-header>

            <md-table-body >
                <md-table-row v-for="(item, itemIndex) in items"
                              :key="itemIndex"
                              :md-selection="true"
                              @select="onSelect">
                    <md-table-cell v-for="(column, columnIndex) in columns"
                                   :key="columnIndex">
                        {{ item[column.dataIndex] }}
                    </md-table-cell>
                </md-table-row>
            </md-table-body>
        </md-table>
    </md-table-card>
</template>

<script>
    export default {
        name: 'AbstractItemGrid',
        props: {
            columns: {
                type: Array,
                required: true
            },
            items: {
                type: Array,
                required: false
            }
        },
        data: function () {
            return {}
        },
        methods: {
            onSelect (selectedItems) {
                let me = this;

                me.$emit('select', selectedItems);
            }
        }
    }
</script>

<style scoped>

    .core-table-root {
        margin: 10px;
        padding: 5px;
    }

    .core-table-header-cell.md-table-head {
        position: relative;
        text-align: center;
    }

</style>
