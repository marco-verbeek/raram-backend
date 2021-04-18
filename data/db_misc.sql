-- Misc requests used during testing of DB.

SELECT * FROM raram.users;
SELECT * FROM raram.verifications;
SELECT * FROM raram.matches GROUP BY match_id, account_id;
SELECT * FROM raram.stats;
SELECT u.summoner_name, u.lp, s.games_played, s.current_winstreak, s.highest_winstreak FROM raram.users u, raram.stats s WHERE u.account_id = s.account_id

--UPDATE raram.users SET raram_date = '2021-04-17 17:06:13.026301' WHERE summoner_name = 'ItsNexty';
--UPDATE raram.users SET raram_amount = 2 WHERE summoner_name = 'ItsNexty';
--DELETE FROM raram.matches WHERE account_id = '' AND match_id = '5219460681';