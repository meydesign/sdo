// Helper functions
// ----------------------------------------------------------------------------


// Event handlers
// ----------------------------------------------------------------------------
$('.nav-tabs > li > a').click(function clickCallback(event) {
  event.preventDefault();
  $(this).tab('show');
});
