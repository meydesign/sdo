// Helper functions
// ----------------------------------------------------------------------------
function serializeObject(form) {
  var o = {};
  var a = form.serializeArray();
  $.each(a, function eachCallback() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
}

// Event handlers
// ----------------------------------------------------------------------------
$(document).ready(function docReadyCallback() {
  var searchTable;
  // $.ajax(
  //   {
  //     url: '/users',
  //   }
  // )
  // .done(function dontCallback() {
  //   return;
  // })
  // .fail(function failCallback() {
  //   return;
  // });

  $('input[name="parcel"]').inputmask('99-99-99-999-999.999-999');
  $('input[name="transfer-date-from"]').inputmask('date');
  $('input[name="transfer-date-to"]').inputmask('date');
  $('input[name="sold-date-from"]').inputmask('date');
  $('input[name="sold-date-to"]').inputmask('date');
  $('input[name="sold-price-from"]').inputmask('currency');
  $('input[name="sold-price-to"]').inputmask('currency');

  $('#search_form').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: false,
    rules: {
      sdoId: {
        number: true,
      },
      sdfId: {},
      parcel: {
        number: true,
      },
      legacy_parcel: {
        number: true,
      },
      sold_price_from: {},
      sold_price_to: {},
      sold_date_from: {},
      sold_date_to: {},
      transfer_date_from: {},
      transfer_date_to: {},
    },
    messages: {
      sdoId: {},
      sdfId: {},
      parcel: {},
      legacy_parcel: {},
      sold_price_from: {},
      sold_price_to: {},
      sold_date_from: {},
      sold_date_to: {},
      transfer_date_from: {},
      transfer_date_to: {},
    },
    highlight: function highlistFn(label) {
      $(label).closest('.form-group').addClass('has-error');
    },
    submitHandler: function submitCallback() {
      alert('form submitted');
      searchTable.ajax.reload();
      return;
    },
  });

  $('#search_reset').click(function clickCallback() {
    document.getElementById('search_form').reset();
  });

  searchTable = $('#search_table').DataTable(
    {
      ajax: {
        url: '/api/sdo/table',
        type: 'POST',
        dataType: 'json',
        data: function dataFn(d) {
          console.log(serializeObject($('#search_form')));

          return $.extend({}, d, serializeObject($('#search_form')));
        },
      },
      order: [],
      pageLength: 10,
      deferLoading: 0,
      autoWidth: true,
      searching: false,
      processing: true,
      deferRender: true,
      language: {
        emptyTable: 'No records',
      },
      responsive: {
        breakpoints: [
          {
            name: 'collg',
            width: Infinity,
          },
          {
            name: 'colmd',
            width: 1184,
          },
          {
            name: 'colsm',
            width: 976,
          },
          {
            name: 'colxs',
            width: 752,
          },
        ],
        details: {
          type: 'column',
          target: 0,
          renderer: function rendererFn(api, rowIdx) {
            return '';
          },
        },
      },
      // serverParams: function serverParamsCallback(data) {
      //   data.bChunkSearch = true;
      // },
      columns: [
        {
          className: 'control',
          orderable: false,
          data: function dataFn() {
            return null;
          },
        },
        {
          data: 'DLGPin',
          className: 'all dt-col-nowrap',
          render: function renderFn(data, type, full) {
            return '<a href="#" target="_blank">' + full.DLGFPin + '</a><br /><br />' + full.DLGFPropertyAddress;
          },
        },
        {
          data: 'ConveyanceDate',
          className: 'min-colsm',
        },
        {
          data: 'SalePrice',
          className: 'min-colsm',
        },
        {
          data: 'DLGFBuyerFullName',
          className: 'min-collg',
        },
        {
          data: 'DLGFSellerFullName',
          className: 'min-collg',
        },
        {
          data: function dataFn() {
            return null;
          },
          className: 'all',
        },
      ],
    }
  );
});
