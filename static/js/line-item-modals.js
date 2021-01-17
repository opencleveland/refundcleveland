(function () {
    let see_details_btns = document.getElementsByClassName("category_details");

    for (let i = 0; i < see_details_btns.length; i++) {
        see_details_btns[i].addEventListener("click", function () {
            let modal = document.getElementById("cat" + i);
            modal.style.display = "block";

            // Close the modal on close button click
            let span = document.getElementById("close" + i);
            span.onclick = function () {
                modal.style.display = "none";
            }

            // Close the modal on a click outside of the modal
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }

        });
    }
})();
