<?php
// Function to validate email
function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to sanitize input
function sanitize_input($input) {
    return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
}

$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
$visitor_email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$subject = isset($_POST['course']) ? sanitize_input($_POST['course']) : '';
$message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

// Validate email
if (!is_valid_email($visitor_email)) {
    exit("Invalid email address");
}

$email_from = 'info@highflightedu.in';
$email_subject = 'New Form Submission';

$email_body = "User Name: $name,\n" .
    "User Email: $visitor_email,\n" .
    "Subject: $subject,\n" .
    "User Message: $message.\n";

$to = 'highflightedu@gmail.com';

$headers = "From: $email_from \r\n";
$headers .= "Reply-To: $visitor_email \r\n";

// Prevent header injection
$name = str_replace(array("\r", "\n"), '', $name);
$visitor_email = str_replace(array("\r", "\n"), '', $visitor_email);

// Send email and handle errors
if (mail($to, $email_subject, $email_body, $headers)) {
    header("Location: contact.html");
} else {
    // Log or display an error message
    echo "Error sending email";
}
?>
