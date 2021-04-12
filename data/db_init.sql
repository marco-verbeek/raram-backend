DROP SCHEMA IF EXISTS raram CASCADE;
CREATE SCHEMA raram;

CREATE TABLE raram.users (
	summoner_name VARCHAR (16) PRIMARY KEY,
	account_id VARCHAR (64) UNIQUE NOT NULL,
	lp FLOAT DEFAULT 0
);
					   
CREATE TABLE raram.verifications (
	verification_id SERIAL PRIMARY KEY,
	account_id VARCHAR (64) UNIQUE NOT NULL,
	icons INTEGER[3] DEFAULT '{0, 1, 2}'
);

CREATE TABLE raram.matches (
	match_id VARCHAR (32) NOT NULL, 
	account_id VARCHAR (64) NOT NULL,
	champion_id INTEGER NOT NULL,
	date TIMESTAMP DEFAULT current_timestamp,
	lp_gain INTEGER DEFAULT 0,
	
	PRIMARY KEY(match_id, account_id),
	CONSTRAINT fk_account_id FOREIGN KEY(account_id) REFERENCES raram.users(account_id)
);
