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

CREATE TABLE raram.stats (
	account_id VARCHAR (64) NOT NULL,
	kills INTEGER DEFAULT 0,
	deaths INTEGER DEFAULT 0,
	assists INTEGER DEFAULT 0,
	games_won INTEGER DEFAULT 0,
	games_played INTEGER DEFAULT 0,
	damage_done INTEGER DEFAULT 0,
	damage_taken INTEGER DEFAULT 0,
	healed INTEGER DEFAULT 0,
	double_kills INTEGER DEFAULT 0,
	triple_kills INTEGER DEFAULT 0,
	quadra_kills INTEGER DEFAULT 0,
	penta_kills INTEGER DEFAULT 0,
	gold_earned INTEGER DEFAULT 0,
	gold_spent INTEGER DEFAULT 0,
	minions_killed INTEGER DEFAULT 0,
	first_bloods INTEGER DEFAULT 0,
	longest_alive INTEGER DEFAULT 0,
	current_winstreak INTEGER DEFAULT 0,
	highest_winstreak INTEGER DEFAULT 0,
	
	PRIMARY KEY(account_id),
	CONSTRAINT fk_account_id FOREIGN KEY(account_id) REFERENCES raram.users(account_id)
);

INSERT INTO raram.verifications(account_id, icons) VALUES('_LtStkq6nDAuthlcw8ns0c_SRdnyuoguzmLIAmyL5YVF_g', '{}');
INSERT INTO raram.users(account_id, summoner_name) VALUES('_LtStkq6nDAuthlcw8ns0c_SRdnyuoguzmLIAmyL5YVF_g', 'ItsNexty');
INSERT INTO raram.stats(account_id) VALUES('_LtStkq6nDAuthlcw8ns0c_SRdnyuoguzmLIAmyL5YVF_g');

INSERT INTO raram.verifications(account_id, icons) VALUES('H6zFnXpuZvZuWwpHScsdT30NTFynN2XvM_2ulZwqn8400kA', '{}');
INSERT INTO raram.users(account_id, summoner_name) VALUES('H6zFnXpuZvZuWwpHScsdT30NTFynN2XvM_2ulZwqn8400kA', 'ItsWolfy');
INSERT INTO raram.stats(account_id) VALUES('H6zFnXpuZvZuWwpHScsdT30NTFynN2XvM_2ulZwqn8400kA');

INSERT INTO raram.verifications(account_id, icons) VALUES('t-gqEaZF54d30hskcUpAKgH8MaYoiFIoQnmkrOyrokSaGQA', '{}');
INSERT INTO raram.users(account_id, summoner_name) VALUES('t-gqEaZF54d30hskcUpAKgH8MaYoiFIoQnmkrOyrokSaGQA', '0wly');
INSERT INTO raram.stats(account_id) VALUES('t-gqEaZF54d30hskcUpAKgH8MaYoiFIoQnmkrOyrokSaGQA');

INSERT INTO raram.verifications(account_id, icons) VALUES('kLo8DCz3v3XOqIQGCcYk5_Jh8nPnzo6GPYRT-v-XFO8RAA', '{}');
INSERT INTO raram.users(account_id, summoner_name) VALUES('kLo8DCz3v3XOqIQGCcYk5_Jh8nPnzo6GPYRT-v-XFO8RAA', 'ItsDucky');
INSERT INTO raram.stats(account_id) VALUES('kLo8DCz3v3XOqIQGCcYk5_Jh8nPnzo6GPYRT-v-XFO8RAA');

--SELECT * FROM raram.users;
--SELECT * FROM raram.verifications;
--SELECT * FROM raram.matches;
--SELECT * FROM raram.stats;
--SELECT u.summoner_name, u.lp, s.current_winstreak, s.highest_winstreak FROM raram.users u, raram.stats s WHERE u.account_id = s.account_id