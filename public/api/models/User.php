<?php
    class User {
        private $conn;
        private $table_name = "Users";

        public $id;
        public $username;
        public $password;
        public $secret;
        public $type;

        public function __construct($db){
            $this->conn = $db;
        }

        function loginCheck($user){
            $query = "SELECT * FROM " . $this->table_name . " WHERE `secret` = :secret AND `username` = :username AND `password` = :password";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':secret', $user->secret);
            $stmt->bindParam(':username', $user->username);
            $stmt->bindParam(':password', $user->password);
            $stmt->execute();

            return $stmt;
        }
        function loginUser($user){
            $configPath = __DIR__ . '/config.ini';
            if (file_exists($configPath)) {
                $configData = file_get_contents($configPath);
                if ($configData === false) {
                    error_log("Error: Unable to read the config.ini file");
                    exit("Error: Unable to read the config.ini file");
                } else {
                    echo $configData;
                }
                $config = parse_ini_string($configData);
                if ($config === false) {
                    error_log("Error: Unable to parse the config.ini data");
                    exit("Error: Unable to parse the config.ini data");
                } else {
                    print_r($config);
                }
            }

            $query = "SELECT * FROM " . $this->table_name . " WHERE `username` = :username AND `password` = SHA1(CONCAT(:salt,:password))";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $user->username);
            $stmt->bindParam(':password', $user->password);
            $stmt->bindParam(':salt', $config["db_salt"]);
            $stmt->execute();
            return $stmt;
        }

    }

?>