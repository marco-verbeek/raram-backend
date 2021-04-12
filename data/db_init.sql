DROP SCHEMA IF EXISTS raram CASCADE;
CREATE SCHEMA raram;

CREATE TABLE raram.users (
	account_id VARCHAR (64) UNIQUE NOT NULL,
	summoner_name VARCHAR (16),
	lp FLOAT DEFAULT 0,
	
	PRIMARY KEY(account_id)
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
	lp_gain FLOAT DEFAULT 0,
	
	PRIMARY KEY(match_id, account_id),
	CONSTRAINT fk_account_id FOREIGN KEY(account_id) REFERENCES raram.users(account_id)
);

INSERT INTO raram.verifications(account_id, icons) VALUES('_LtStkq6nDAuthlcw8ns0c_SRdnyuoguzmLIAmyL5YVF_g', '{}');
INSERT INTO raram.users(account_id, summoner_name) VALUES('_LtStkq6nDAuthlcw8ns0c_SRdnyuoguzmLIAmyL5YVF_g', 'ItsNexty');

--SELECT * FROM raram.users;
--SELECT * FROM raram.verifications;
--SELECT * FROM raram.matches;