$(document).ready(function () {
    //call API to show dashboard
    getAmmountByDay();
    countTotalOrder();
    sumTotalAmmountOrder();
    countTotalCustomer()
    //call API lấy doanh thu mỗi ngày để show lên chart
    function getAmmountByDay() {
        $.ajax({
            url: "http://localhost:8080/order/getAmmountByDay",
            type: "GET",
            success: function (pAmmountByDayRes) {
                var vChartLabel = [];
                var vChartData = []
                for (i = 0; i < pAmmountByDayRes.length; i++) {
                    var bDate = new Date(pAmmountByDayRes[i].order_date).toLocaleDateString("vi");
                    //console.log(bDateString);
                    //var bDate = new Date(pAmmountByDayRes[i].order_date).toLocaleDateString("vi");
                    vChartLabel.push(bDate);
                    vChartData.push(pAmmountByDayRes[i].total_ammount);
                    
                }
                drawBarChartAmmount(vChartLabel, vChartData);
            },
        })
    }


    //get API count total order
    function countTotalOrder(){
        $.ajax({
            url: "http://localhost:8080/order/count-total",
            type: "GET",
            success: function (pCountTotalOrderRes) {
                //show to dashboard
                $("#totalOrder").text(pCountTotalOrderRes);
            },
        })
    }

    //get API sum total ammount order
    function sumTotalAmmountOrder(){
        $.ajax({
            url: "http://localhost:8080/order/sum-total",
            type: "GET",
            success: function (pSumTotalOrder) {
                //show to dashboard
                var bTotalAmmountPretty = (pSumTotalOrder/1000000) + "M"
                console.log(pSumTotalOrder);
                $("#totalAmmount").text(bTotalAmmountPretty);
            },
        })
    }

    //get API count total customer
    function countTotalCustomer(){
        $.ajax({
            url: "http://localhost:8080/customer/count-total",
            type: "GET",
            success: function (pCountTotalCustomer) {
                //show to dashboard
                $("#totalCustomer").text(pCountTotalCustomer);
            },
        })
    }

    //-------------
    //- BAR CHART SET UP-
    //-------------

    function drawBarChartAmmount(pChartLabel, pChartData) {
        var vAreaChartData = {
            labels: pChartLabel,
            datasets: [
                {
                    label: 'Doanh thu',
                    backgroundColor: 'rgba(60,141,188,0.9)',
                    borderColor: 'rgba(60,141,188,0.8)',
                    pointRadius: false,
                    pointColor: '#3b8bba',
                    pointStrokeColor: 'rgba(60,141,188,1)',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(60,141,188,1)',
                    data: pChartData
                }
            ]
        }
        var vBarChartCanvas = $('#barChart').get(0).getContext('2d')
        var vBarChartData = $.extend(true, {}, vAreaChartData)
        var temp0 = vAreaChartData.datasets[0]
        vBarChartData.datasets[0] = temp0;

        var vBarChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            datasetFill: false
        }


        new Chart(vBarChartCanvas, {
            type: 'bar',
            data: vBarChartData,
            options: vBarChartOptions
        })
    }




    /*
    *=========DATE INPUT FORMAT=========
    */
    //Khai báo biến Global
    var gStartDate;
    var gEndDate = moment()

    $(function () {
        var vStartDate = moment().subtract(60, 'days');
        var VEndDate = moment();

        function showDateRange(vStartDate, vEndDate) {
            $('#reportRange span').html(vStartDate.format('DD/MM/YYYY') + ' - ' + vEndDate.format('DD/MM/YYYY'));
            gStartDate = vStartDate.format('YYYY-MM-DD');
            gEndDate = vEndDate.format('YYYY-MM-DD');
        }

        //Khai báo date range picker
        $('#reportRange').daterangepicker({
            startDate: vStartDate,
            endDate: VEndDate,
            locale: {
                "format": "DD/MM/YYYY",
            },
            ranges: {
                'Hôm nay': [moment(), moment()],
                'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '7 ngày': [moment().subtract(6, 'days'), moment()],
                '30 ngày': [moment().subtract(29, 'days'), moment()],
                'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, showDateRange);

        showDateRange(vStartDate, VEndDate);
    })


})