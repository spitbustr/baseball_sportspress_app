<?php
    class ScoreSheet {
        private $conn;
        private $table_name = "Scoresheet";

        public $id;
        public $gameId;
        public $jsonObject;



        public function __construct($db){
            $this->conn = $db;
        }

        function getAll(){
            $query = "SELECT * FROM " . $this->table_name;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            return $stmt;
        }
        function getByGameId($gameId){
            $query = "SELECT * FROM " . $this->table_name . " WHERE gameId = :gameId";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':gameId', $gameId);
            $stmt->execute();
            return $stmt;
        }

        function getById($id){
            $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':gameId', $id);
            $stmt->execute();
            return $stmt;
        }

        function add(){
            $query = "INSERT INTO " . $this->table_name . " (gameId, jsonObject) VALUES (:gameId, :jsonObject)";

            // prepare query
            $stmt = $this->conn->prepare($query);
            // bind values
            $stmt->bindParam(":gameId", $this->gameId);
            $stmt->bindParam(":jsonObject", $this->jsonObject);
            // execute query
            if($stmt->execute()){
                $this->conn = null;
                return true;
            }
            die("Error: There is an error somewhere in the Insert method");
            $this->conn = null;
            return false;
        }

        function remove($id) {
            $query = "DELETE FROM ". $this->table_name . " WHERE id = :id";
            // prepare query
            $stmt = $this->conn->prepare($query);
            // bind values
            $stmt->bindParam(":id", $id);
            if($stmt->execute()){
                $this->conn = null;
                return true;
            }
            die("Error: Couldn't find what you were looking for");
            $this->conn = null;
            return false;
        }

        function updateById($newData) {
            $query = "UPDATE " . $this->table_name . " SET jsonObject = :jsonObject, gameId = :gameId WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            // Bind parameters
            $stmt->bindParam(':jsonObject', $newData->jsonObject);
            $stmt->bindParam(':gameId', $newData->gameId);
            $stmt->bindParam(':id', $newData->id);

            if ($stmt->execute()) {
                return true;
            } else {
                return false;
            }
        }
    }

?>