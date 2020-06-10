<template>
    <v-container fluid grid-list-xl>
        <v-layout wrap>
            <v-flex md12 sm12 lg4>
                <MaterialChartCard
                        to="/pfm/admin/user/level"
                        :data="dailySalesChart.data"
                        :options="dailySalesChart.options"
                        color="info" type="Line">
                    <h4 class="title font-weight-light">订单数</h4>
                    <p class="category d-inline-flex font-weight-light">
                        <v-icon color="green" small>mdi-arrow-up</v-icon>
                        <span class="green--text">55%</span>&nbsp;
                        今日订单上升
                    </p>
                    <template slot="actions">
                        <v-icon
                                class="mr-2"
                                small
                        >
                            mdi-clock-outline
                        </v-icon>
                        <span class="caption grey--text font-weight-light">5分钟之前更新</span>
                    </template>
                </MaterialChartCard>
            </v-flex>
            <v-flex md12 sm12 lg4>
                <MaterialChartCard
                        :data="emailsSubscriptionChart.data"
                        :options="emailsSubscriptionChart.options"
                        :responsive-options="emailsSubscriptionChart.responsiveOptions"
                        color="red"
                        type="Bar"
                >
                    <h4 class="title font-weight-light">销售额</h4>
                    <p class="category d-inline-flex font-weight-light">
                        <v-icon color="green" small>mdi-arrow-up</v-icon>
                        <span class="green--text">100%</span>&nbsp;
                        今日销售额上升
                    </p>
                    <template slot="actions">
                        <v-icon
                                class="mr-2"
                                small
                        >
                            mdi-clock-outline
                        </v-icon>
                        <span class="caption grey--text font-weight-light">10分钟之前更新</span>
                    </template>
                </MaterialChartCard>
            </v-flex>
            <v-flex md12 sm12 lg4>
                <MaterialChartCard
                        :data="dataCompletedTasksChart.data"
                        :options="dataCompletedTasksChart.options"
                        color="green"
                        type="Line"
                >
                    <h3 class="title font-weight-light">活跃用户数</h3>
                    <p class="category d-inline-flex font-weight-light">
                    <p class="category d-inline-flex font-weight-light">
                        <v-icon color="green" small>mdi-arrow-up</v-icon>
                        <span class="green--text">20%</span>&nbsp;
                        用户活跃度上升
                    </p>

                    <template slot="actions">
                        <v-icon class="mr-2" small>mdi-clock-outline</v-icon>
                        <span class="caption grey--text font-weight-light">7分钟之前更新</span>
                    </template>
                </MaterialChartCard>
            </v-flex>
            <v-flex sm6 xs12 md6 lg3>
                <MaterialStatsCard
                        color="green"
                        icon="mdi-store"
                        title="会员总数"
                        value="2500"
                        small-value="人"
                        sub-icon="mdi-calendar"
                        sub-text="24小时前更新"
                        to="/pfm/admin/user/user"
                />
            </v-flex>
            <v-flex sm6 xs12 md6 lg3>
                <MaterialStatsCard
                        color="orange"
                        icon="mdi-content-copy"
                        title="订单总数"
                        value="5568"
                        small-value="笔"
                        sub-icon="mdi-alert"
                        sub-icon-color="error"
                        sub-text="实时"
                        sub-text-color="text-primary"
                />
            </v-flex>
            <v-flex sm6 xs12 md6 lg3>
                <MaterialStatsCard
                        color="red"
                        icon="mdi-information-outline"
                        title="总金额"
                        value="75000"
                        small-value="元"
                        sub-icon="mdi-tag"
                        sub-text="Tracked from Github"
                />
            </v-flex>
            <v-flex sm6 xs12 md6 lg3>
                <MaterialStatsCard
                        color="info"
                        icon="mdi-twitter"
                        title="商品数量"
                        value="65876"
                        small-value="件"
                        sub-icon="mdi-update"
                        sub-text="Just Updated"
                />
            </v-flex>
            <v-flex sm6 xs12 md6 lg3>
                <MaterialStatsCard
                        color="indigo"
                        icon="mdi-twitter"
                        title="今日订单数"
                        value="65876"
                        small-value="件"
                        sub-icon="mdi-update"
                        sub-text="Just Updated"
                />
            </v-flex>
            <v-flex sm6 xs12 md6 lg3>
                <MaterialStatsCard
                        color="cyan"
                        icon="mdi-twitter"
                        title="商户数量"
                        value="65876"
                        small-value="户"
                        sub-icon="mdi-update"
                        sub-text="Just Updated"
                />
            </v-flex>
            <v-flex sm6 xs12 md6 lg3>
                <MaterialStatsCard
                        color="lime"
                        icon="mdi-twitter"
                        title="近七天订单数"
                        value="65876"
                        small-value="件"
                        sub-icon="mdi-update"
                        sub-text="Just Updated"
                />
            </v-flex>
            <v-flex sm6 xs12 md6 lg3>
                <MaterialStatsCard
                        color="amber"
                        icon="mdi-twitter"
                        title="本月订单数"
                        value="65876"
                        small-value="件"
                        sub-icon="mdi-update"
                        sub-text="Just Updated"
                />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import MaterialChartCard from "../../../components/base/MaterialChartCard";
    import MaterialStatsCard from "../../../components/base/MaterialStatsCard";
    export default {
        name:'Index',
        components: {MaterialStatsCard, MaterialChartCard},
        data () {
            return {
                dailySalesChart: {
                    data: {
                        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                        series: [
                            [12, 17, 7, 17, 23, 18, 38]
                        ]
                    },
                    options: {
                        lineSmooth: this.$chartist.Interpolation.cardinal({
                            tension: 0
                        }),
                        low: 0,
                        high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                        chartPadding: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        }
                    }
                },
                dataCompletedTasksChart: {
                    data: {
                        labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
                        series: [
                            [230, 750, 450, 300, 280, 240, 200, 190]
                        ]
                    },
                    options: {
                        lineSmooth: this.$chartist.Interpolation.cardinal({
                            tension: 0
                        }),
                        low: 0,
                        high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                        chartPadding: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        }
                    }
                },
                emailsSubscriptionChart: {
                    data: {
                        labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
                        series: [
                            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

                        ]
                    },
                    options: {
                        axisX: {
                            showGrid: false
                        },
                        low: 0,
                        high: 1000,
                        chartPadding: {
                            top: 0,
                            right: 5,
                            bottom: 0,
                            left: 0
                        }
                    },
                    responsiveOptions: [
                        ['screen and (max-width: 640px)', {
                            seriesBarDistance: 5,
                            axisX: {
                                labelInterpolationFnc: function (value) {
                                    return value[0]
                                }
                            }
                        }]
                    ]
                },
                headers: [
                    {
                        sortable: false,
                        text: 'ID',
                        value: 'id'
                    },
                    {
                        sortable: false,
                        text: 'Name',
                        value: 'name'
                    },
                    {
                        sortable: false,
                        text: 'Salary',
                        value: 'salary',
                        align: 'right'
                    },
                    {
                        sortable: false,
                        text: 'Country',
                        value: 'country',
                        align: 'right'
                    },
                    {
                        sortable: false,
                        text: 'City',
                        value: 'city',
                        align: 'right'
                    }
                ],
                items: [
                    {
                        name: 'Dakota Rice',
                        country: 'Niger',
                        city: 'Oud-Tunrhout',
                        salary: '$35,738'
                    },
                    {
                        name: 'Minerva Hooper',
                        country: 'Curaçao',
                        city: 'Sinaai-Waas',
                        salary: '$23,738'
                    }, {
                        name: 'Sage Rodriguez',
                        country: 'Netherlands',
                        city: 'Overland Park',
                        salary: '$56,142'
                    }, {
                        name: 'Philip Chanley',
                        country: 'Korea, South',
                        city: 'Gloucester',
                        salary: '$38,735'
                    }, {
                        name: 'Doris Greene',
                        country: 'Malawi',
                        city: 'Feldkirchen in Kārnten',
                        salary: '$63,542'
                    }
                ],
                tabs: 0,
                list: {
                    0: false,
                    1: false,
                    2: false
                }
            }
        },
        methods: {
            complete (index) {
                this.list[index] = !this.list[index]
            }
        }
    }
</script>
