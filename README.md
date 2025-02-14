Nutzung von dem kram:

1. Hab nixOS mit flakes
2. shell aktivieren:
```bash
nix develop
```
3. astro server starten:
```
cd astro
npm install #optional, falls nicht erstmalig erfolgt
npm run dev
```
4. postgres sachen:
```
cd .. #zurück zum verzeichnisstart
cd data
initdb -D . #optional, falls nicht erstmalig erfolgt

pg_ctl -D . -l logfile start \
  -o "-c listen_addresses='' -c unix_socket_directories='`pwd`'"

psql -h "$(pwd)" -d postgres
```

wichtig! immer den server vor beenden stoppen:
```
pg_ctl -D . stop
```
