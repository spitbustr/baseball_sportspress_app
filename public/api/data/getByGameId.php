<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/Database.php';
include_once '../models/Scoresheet.php';

$database = new Database();
$db = $database->getConnection();

$scoresheet = new Scoresheet($db);

if (isset($_GET['gameId'])) {
    $gameId = htmlspecialchars(strip_tags($_GET['gameId']));

    $stmt = $scoresheet->getByGameId($gameId);
    $num = $stmt->rowCount();

    if ($num > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        http_response_code(200);
        echo json_encode($row);
    } else {
        http_response_code(404);
        echo json_encode(
            array("message" => "Item with ID $gameId not found.")
        );
    }
}
?>