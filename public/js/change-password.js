/* eslint-disable no-undef */
$("#changePasswordForm").on("submit", async function (e) {
  e.preventDefault();
  const formData = $(this).serialize();

  try {
    const response = await fetch("/profile/change-password", {
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
    // consol.log("Error occurred:", error);
    $("#responseMessage").text("An error occurred. Please try again.");
    $("#responseModal").modal("show");
  }
});
