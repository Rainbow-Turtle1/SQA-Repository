/* eslint-disable no-undef */
$("#editProfileForm").on("submit", async function (e) {
  e.preventDefault();
  const formData = $(this).serialize();

  try {
    const response = await fetch("/profile/edit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    const result = await response.json();

    $("#responseMessage").text(result.message);
    $("#responseModal").data("redirectUrl", result.redirectUrl || null);
    $("#responseModal").modal("show");

    $("#responseModal").on("hidden.bs.modal", function () {
      const redirectUrl = $("#responseModal").data("redirectUrl");
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    });
  } catch (error) {
    console.log("Error occurred:", error);
    $("#responseMessage").text("An error occurred. Please try again.");
    $("#responseModal").modal("show");
  }
});
