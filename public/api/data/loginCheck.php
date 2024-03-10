<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/Database.php';
    include_once '../models/User.php';

    $database = new Database();
    $db = $database->getConnection();
    $config = parse_ini_file('../config/config.ini');
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