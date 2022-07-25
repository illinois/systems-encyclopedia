# Sockets

Sockets are a form of [inter-process communication](../ipc) that use byte streams in order to communicate between processes. Unlike other forms of IPC, sockets are unique in that they can be used to communicate between process on different machines over a network, making sockets fundamental to the foundations of computer networking. Here, we will give a practical overview of sockets for networking over Unix-like systems, and provide a brief demonstration of how to use sockets in C.

## Overview

Like [pipes](../pipes), sockets are implemented as [streams](https://en.wikipedia.org/wiki/Stream_(computing)) of bytes. In fact, sockets *can* be used in a basically equivalent fashion to pipes, communicating between two local processes on a machine in an unstructured, in-order manner. That said, sockets are unique from pipes in that they are used for cross-network communication, which is governed by a number of different protocols that control a number of important properties, making the behavior among different sockets much less uniform than pipes. Sockets can vary in the following ways:

- **Data structure**: The way that data sent to and from the socket is structured. Data can either be structured into raw bytes, or **datagrams**, a basic unit of information that has a maximum length of `n` bytes.
- **Connectivity**: Whether or not the socket requires two machines to first connect to each other in order to be able to send and receive data.
- **Reliability**: Whether or not the data can be lost if there is a network error during packet transmission. Reliable data is always guaranteed to be received in full, whereas unreliable data can have pieces of information missing.
- **Ordering**: Whether or not the data is required to be received in the exact same order that it is sent. For example, if the data `"abc"` is guaranteed to be ordered, it will always be received as `"abc"` and not `"cba"` or `"acb"`.

Sockets are also bound to an **address**, which in the case of modern networking is typically an IPv4 or IPv6 address followed by a port number. For a somewhat silly analogy, we can think of requesting a socket as somewhat like setting up a satellite on a process. We can communicate to any other satellite whose location we know, or receive information from satellites that know about us:

![img](../static/sockets/satellite-diagram.png)

The vast majority of modern sockets that are used to communicate over the internet use [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) or [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol).

## POSIX Sockets

Given that sockets are more elaborate than pipes, there are multiple different POSIX syscalls needed in order to properly set up and manage them. Unix-like systems implement the following syscalls (described in terms of their C wrapper functions here) for setting up and configuring sockets:

### **`socket()`**

```
int socket(int domain, int type, int protocol);
```

`socket()` will ask the host operating system to open a socket, returning the file descriptor of the newly opened socket or `-1` on failure.

`socket()` takes the following arguments:
- `domain`: A constant defining the family of communication protocols the socket will adhere to. For most modern applications, sockets will typically use the IPv4 (`AF_INET`) or IPv6 (`AF_INET6`). A list of constants specifying communication domains can be found [here](https://man7.org/linux/man-pages/man2/socket.2.html). 
- `type`: A constant defining the structure of the data sent to and from the socket and the mode in which it is sent. Modern sockets will typically use one of two types (a list of constants specifying type can be found [here](https://man7.org/linux/man-pages/man2/socket.2.html)):
  - `SOCK_STREAM`: A stream-based, reliable, ordered, communication style that occurs over a two way connection. Readers familiar with communication protocols should note that this communication style is equivalent to that outlined by the TCP protocol.
  - `SOCK_DGRAM`: A datagram-based, unreliable, unordered, connectionless communication style. Readers should also note that this is communication style is equivalent to that outlined by the UDP protocol.
- `protocol`: A constant specifying specific protocol to be used in the communication domain specified by `domain`. For domains that do not have multiple protocols within them (as is the case for `AF_INET` and `AF_INET6`), this argument should be set to `0`. To find the number that maps to a specific protocol in a domain, see the specification for the `getprotent` [here](https://man7.org/linux/man-pages/man3/getprotoent.3.html).

Any socket that has been opened with the `socket()` syscall should eventually be closed with the `close()` syscall, which will close any file descriptor.

### **`bind()`**

```c
int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
```

`bind()` will bind the specified file descriptor of a socket to an **address**, which consists of an IP address and a port number. `bind()` effectively opens the socket to receive information from across a network. `bind()` will return `-1` on failure and `0` on success.

`bind()` takes the following arguments:
- `sockfd`: The file descriptor of the socket that is to be bound to the address.
- `sockaddr`: A pointer to a `sockaddr` struct containing information about the address. The structure and contents of the `sockaddr` struct will differ depending on the protocol that is being used. We will cover how the most important `sockaddr` structs are structured later.
- `addrlen`: The length of the address struct. In C code, this can easily be fetched by calling `sizeof` on your `sockaddr` struct.

### **`listen()`**

```c
int listen(int sockfd, int backlog);
```

`listen()` will designate a socket as a "passive socket", meaning that it is a socket that is meant to receive incoming connections (i.e. other processes using the `connect()` syscall). A socket can receive multiple connections while it is listening, and incoming connections are ordered in a queue until they are accepted.

`listen()` takes the following arguments:
- `sockfd`: The file descriptor of the socket to be opened to incoming connections.
- `backlog`: An integer defining the maximum number of connections that can sit in the connection queue. If the queue exceeds `backlog`, then any client that attempts to connect to a passive socket will receive a `ECONNREFUSED` error.

### **`accept()`**

```c
int accept(int sockfd, struct sockaddr *restrict addr, socklen_t *restrict addrlen);
```

For any passive socket, `accept()` will accept the first incoming connection listed on that socket's queue, and return a file descriptor of a *new* socket that that is able to send information to and from the client that has connected. The already existing socket that has been listening for connections will continue to do so.

`accept()` takes the following arguments:
- `sockfd`: The file descriptor of the socket that is accepting incoming connections.
- `addr`: An empty `sockaddr` struct. If `accept()` completes successfully, `addr` will be filled with the address information of the socket that is attempting to connect. If `addr` is set to `NULL`, no information will be filled in.
- `addrlen`: The length of `addr`. See `bind()` for more information.

### **`connect()`**

```c
int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
```

`connect()` will attempt to open a connection between the socket specified by `sockfd` and a `listen()`ing socket on the address specified by `addr`. For all sockets using TCP or another connection based protocol (i.e. `SOCK_STREAM`), any client wishing to receive information must first establish a connection to a remote address contained in `addr` before sending and receiving information. For sockets that use the UDP protocol (i.e. `SOCK_DGRAM`), this will not establish a connection, but will designate the default address to send and receive information from with the `send()` and `recv()` syscalls.

`connect()` takes the following arguments:
- `sockfd`: The socket on the host machine to be connected.
- `sockaddr`: The address of the socket that is to be connected to.
- `addrlen`: The length of `addr`. See the `bind()` spec to see how to easily get the struct size.

### `send()`, `recv()`, `sendto()`, and `recvfrom()`

```c
ssize_t send(int sockfd, const void *buf, size_t len, int flags);
ssize_t recv(int sockfd, void *buf, size_t len, int flags);
```

`send()` and `recv()` will send and receive information over a TCP-style socket. In order to successfully send information over a network, the socket must be connected with the `listen`-`connect`-`accept` mnemonic.

`send()` and `recv()` take the following arguments:
- `sockfd`: The file descriptor of the socket over which to send or receive data.
- `buf`: A pointer to a buffer. In the case of `send()`, data will be sent from the specified buffer, and for `recv()` data read from the socket will be written to the buffer.
- `len`: The length of the data to be sent or received from the socket, in bytes.
- `flags`: A number of options connected via the OR bitwise operator specifying the behavior of the read/write. You can find a list of applicable flags [here](https://man7.org/linux/man-pages/man2/send.2.html).

```c
ssize_t sendto(int sockfd, const void *buf, size_t len, int flags, const struct sockaddr *dest_addr, socklen_t addrlen);
ssize_t recvfrom(int sockfd, void *restrict buf, size_t len, int flags, struct sockaddr *restrict src_addr, socklen_t *restrict addrlen);
```

`sendto()` and `recvfrom()` accomplish a functionality equivalent to `send()` and `recv()` but should be used for UDP-style sockets. Because UDP is connectionless, the socket does not need to (and should not) establish a connection.

`sendto()` and `recvfrom()` take two additional arguments:
- `dest_addr`/`src_addr`: The address of the destination to send data to or from.
- `addrlen`: The length of `dest_addr`/`src_addr`/.

It is worth noting that all of the syscalls mentioned here can be equivalent to the `read()` and `write()` syscalls (which will generically read and write to any file descriptor) when `flags` is set to `0`, although we recommend using `send()` and `recv()` when communicating across networks for readability's sake.

### `sockaddr` structs

## Using sockets in C

Here, we will provide a brief demonstration of setting up both a simple TCP and UDP server using the syscalls that we have covered.

### Setting up a TCP server

With the following snippet, we set up a socket that uses the TCP protocol that will read and print any messages that it receives from another socket.

```c
# define QUEUE_SIZE 10

int main(int arc, char** argv) {
  char buf[1024]; 

  if (argc != 2) {
    fprintf(stderr, "Usage: %s <port> \n", argv[0]);
  }

  // set up a TCP-IPv4 socket
  int sockfd = socket(AF_INET, SOCK_STREAM, 0);

  // set the port number to be the first argument from argv
  int port = atoi(argv[1]);
  
  // set up server address information
  struct sockaddr_in server_addr;
  bzero((char *) &server_addr, sizeof(server_addr)); // zero out our struct
  server_addr.sin_family = AF_INET;
  server_addr.sin_addr.s_addr = htonl(INADDR_ANY); // set our socket to bind to all IPs of the machine
  server_addr.sin_port = htonl(port);

  // set our socket to listen for incoming connections, allowing at most 10 pending connections
  listen(sockfd, QUEUE_SIZE);

  struct sockaddr_in client_addr;
  int clientlen = sizeof(client_addr);
  while (1) {
    bzero(buf, 1024); // zero out our buffer so that it is fresh

    // accept a new connection, receive data, print, then send back to client
    int new_connection = accept(parentfd, (struct sockaddr *) &client_addr, clientlen);
    int message_size = recv(new_connection, buf, 1024, 0);
    printf("Server received %d bytes: %s\n", message_size, buf);
    message_size = send(sockfd, buf, message_size, 0, ();
  }
}
```

### Setting up a UDP server

With the following snippet, we set up a socket that uses the UDP protocol that will read and print any messages that it receives from another socket.

```c
int main(int argc, char **argv) {
  char buf[1024];

  if (argc != 2) {
    fprintf(stderr, "Usage: %s <port>\n", argv[0]);
    exit(1);
  }

  // set up a UDP-IPv4 socket
  int sockfd = socket(AF_INET, SOCK_DGRAM, 0);

  // set our port number to be the first argument from argv
  int port = atoi(argv[1]);

  // set up server address information
  struct sockaddr_in server_addr;
  bzero((char *) &server_addr, sizeof(server_addr)); // zero out our struct
  server_addr.sin_family = AF_INET;
  server_addr.sin_addr.s_addr = htonl(INADDR_ANY); // set our socket to bind to all IPs of the machine
  server_addr.sin_port = htonl(port);

  // bind the socket to the address we just specified
  bind(sockfd, (struct sockaddr *) &server_addr, sizeof(server_addr));

  printf("Server started on address %s...\n", inet_ntoa(server_addr.sin_addr));

  struct sockaddr_in client_addr;
  int clientlen = sizeof(client_addr);
  while (1) {
    bzero(buf, 1024);

    // receive, print, and send back information to the client
    int message_size = recvfrom(sockfd, buf, 1024, 0, (struct sockaddr *) &client_addr, &clientlen);
    printf("Server received %d bytes: %s\n", message_size, buf);
    message_size = sendto(sockfd, buf, strlen(buf), 0, (struct sockaddr *) &client_addr, clientlen);
  }
}
```

Since this socket is bound to the address specified by `INADDR_ANY`, running this code will produce the following input before the server loop:

{% output %}
Server started on address 0.0.0.0...
{% endoutput %}
