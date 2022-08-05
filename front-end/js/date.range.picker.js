$(document).ready(function () {
    $(function () {

        var start = moment().subtract(60, 'days');
        var end = moment();

        function cb(start, end) {
            $('#reportRange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }

        $('#reportRange').daterangepicker({
            startDate: start,
            endDate: end,
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
        }, cb);

        cb(start, end);

    });
})

