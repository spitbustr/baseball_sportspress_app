<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/Database.php';
    include_once '../models/User.php';

    $database = new Database();
    $db = $database->getConnection();
    $path = substr(__DIR__, 0, 38);
    $configPath = $path . '/api/config/config.ini';
if (file_exists($configPath)) {
    $configData = file_get_contents($configPath);
    if ($configData === false) {
        error_log("Error: Unable to read the config.ini file");
        exit("Error: Unable to read the config.ini file");
    } 
    $config = parse_ini_string($configData);
    if ($config === false) {
        error_log("Error: Unable to parse the config.ini data");
        exit("Error: Unable to parse the config.ini data");
    } 
}
    $user = new User($db);

    // Check the request method
    $method = $_SERVER['REQUEST_METHOD'];
    if($method === "POST") {
        // Initialize $data as an object
        $data = new stdClass();
        $input_data = file_get_contents('php://input');
        // Decode the JSON data
        $json_data = json_decode($input_data);

        // Access the properties
        $data->username = !empty($json_data->username) ? $json_data->username : "";
        $data->password = !empty($json_data->password) ? $json_data->password : "";
        $data->secret = !empty($json_data->secret) ? $json_data->secret  : "";
        if (!empty($data->secret)) {
            $stmt = $user->loginCheck($data);
            $num = $stmt->rowCount();
            if ($num > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                http_response_code(200);
                echo json_encode($num);
            } else {
                echo $data->username . "check";
                echo $data->password;
                http_response_code(401);
                echo json_encode(array("error" => "Not logged in" ));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "No key"));
        }
    } else {
        echo "WRONG METHOD";
    }


?>