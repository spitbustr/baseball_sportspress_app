<?php
    class Database{
        private $conn;
        public function getConnection(){
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
        } else {
            error_log("Error: config.ini file not found");
            exit("Error: config.ini file not found");
        }            $this->conn = null;
            try{
                $this->conn = new PDO("mysql:host=" . $config['db_host'] . ";dbname=" .  $config['db_database'],  $config['db_user'], $config['db_password']);

            }catch(PDOException $exception){
                echo "Connection error: " . $exception->getMessage();
            }

            return $this->conn;
        }
    }
?>