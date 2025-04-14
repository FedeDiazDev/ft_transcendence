```
 .-') _   _  .-')     ('-.         .-') _   .-')                 ('-.       .-') _  _ .-') _     ('-.       .-') _             ('-.   
(  OO) ) ( \( -O )   ( OO ).-.    ( OO ) ) ( OO ).             _(  OO)     ( OO ) )( (  OO) )  _(  OO)     ( OO ) )          _(  OO)  
/     '._ ,------.   / . --. /,--./ ,--,' (_)---\_)   .-----. (,------.,--./ ,--,'  \     .'_ (,------.,--./ ,--,'  .-----. (,------. 
|'--...__)|   /`. '  | \-.  \ |   \ |  |\ /    _ |   '  .--./  |  .---'|   \ |  |\  ,`'--..._) |  .---'|   \ |  |\ '  .--./  |  .---' 
'--.  .--'|  /  | |.-'-'  |  ||    \|  | )\  :` `.   |  |('-.  |  |    |    \|  | ) |  |  \  ' |  |    |    \|  | )|  |('-.  |  |     
   |  |   |  |_.' | \| |_.'  ||  .     |/  '..`''.) /_) |OO  )(|  '--. |  .     |/  |  |   ' |(|  '--. |  .     |//_) |OO  )(|  '--.  
   |  |   |  .  '.'  |  .-.  ||  |\    |  .-._)   \ ||  |`-'|  |  .--' |  |\    |   |  |   / : |  .--' |  |\    | ||  |`-'|  |  .--'  
   |  |   |  |\  \   |  | |  ||  | \   |  \       /(_'  '--'\  |  `---.|  | \   |   |  '--'  / |  `---.|  | \   |(_'  '--'\  |  `---. 
   `--'   `--' '--'  `--' `--'`--'  `--'   `-----'    `-----'  `------'`--'  `--'   `-------'  `------'`--'  `--'   `-----'  `------' 
```

### Start Up

*So far, only SPA / frontend supported on nginx*

Run the project with the following command: `docker compose up --build`

### Browse the web

The frontend will be available on transcendence.fr:8080

Remember to mock backend to make it available. Point localhost IP to transcendence.fr in /etc/hostsqq:
```
sudo vim /etc/hosts

#
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1	      transcendence.fr
255.255.255.255	broadcasthost
::1               localhost

```

