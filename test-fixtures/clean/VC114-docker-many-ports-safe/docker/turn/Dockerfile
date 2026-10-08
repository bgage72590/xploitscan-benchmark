# TURN relay for the app's WebRTC video calls
FROM coturn/coturn:4.6.2

COPY turnserver.conf /etc/coturn/turnserver.conf

# STUN/TURN on 3478 and TURN over TLS on 5349, each over UDP and TCP
EXPOSE 3478/udp 3478/tcp
EXPOSE 5349/udp 5349/tcp

CMD ["-c", "/etc/coturn/turnserver.conf"]
