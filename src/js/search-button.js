$("#button-addon2").mousedown(function () {
	$(this).addClass("pressed");
});
$("#button-addon2").mouseup(function () {
	$(this).removeClass("pressed");
});
$("#button-addon2").mouseout(function () {
	$(this).removeClass("pressed");
});