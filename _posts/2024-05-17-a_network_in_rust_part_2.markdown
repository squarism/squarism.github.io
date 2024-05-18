---
layout: post
status: published
published: true
title: A Network in Rust, Part 2
date: 2024-05-17
---

This post is part 2 of a series.  We are learning networking by building it.

* [Part 1](/2024/05/05/a_network_in_rust_part_1/) - covers networking basics and implmented MAC addressing


## More Primitives

Let's model an IP address next.  Luckily, Rust has one already as [std::net::Ipv4Addr](https://doc.rust-lang.org/std/net/struct.Ipv4Addr.html) but it does not include all the functionality we need.  It is just the data represenation of an IP address.  We need what is routing.

I'm certain you've seen an IP address before.  The interesting thing about an IP address is that it usually goes together with a [subnet mask](https://en.wikipedia.org/wiki/Subnet#Subnetting) and a gateway address.  These three things together tells the IP stack whether an address is local or not.  If it's not local, it sends it to a router.  If it is local, it continues to send the message, usually to the local network.

In our simple example, we won't implement a router but we still want to explore this network concept so we'll implement it as a function even if it will inevitablly return `true`.  Figuring out if a network address is local or not is not something Rust can do with stdlib.  But the logic is pretty simple and can be expressed in 4 lines of Rust.

What we need to do to figure out if our IP message is local is look at the source IP, destination IP and subnet mask:

1. Take the source IP address and figure out the network address.  The network address is a bitmask of the subnet mask and the IP address.  This is why it's called a subnet mask.  You just AND the bits up.  I explain this later.
2. Take the destination IP address and do the same thing.
3. Now you have two network addresses.  Source network address and destiation network address.
4. Compare the two networks.  If they are the same, send it locally (ie: Ethernet).  If they aren't, send the IP message to the router.


### The Mask in Subnet Mask

Let's say we have this IP address and subnet mask.

```
IP Address:  192.168.0.1
Subnet Mask: 255.255.255.0
```

We can explode this out into bits because each number is an 8-bit number in IP version 4.

```
IP:   11000000.10101000.00000000.00000001
Mask: 11111111.11111111.11111111.00000000
```

If we logically AND these together (only print a 1 if both are 1) then we get this:

```
11000000.10101000.00000000.00000000
```

Which if you turn into decimal again is `192.168.0.0`.  This tells us what the network address is.  In other words, if we do the same for an IP address which is "next to" `192.168.0.1` like `192.168.0.42` then the network address is the same.  This is what the mask does.  It's a bit mask by an bit-wise AND operation.

```
IP Address:  192.168.0.1
Subnet Mask: 255.255.255.0
Network:     192.168.0.0

IP Address:  192.168.0.42
Subnet Mask: 255.255.255.0
Network:     192.168.0.0
```

So, you can see that the Network address for ` 192.168.0.1` and ` 192.168.0.42` above are both the same `192.168.0.0`.  That means, don't route it.  It's on the same network, just send it locally (make an Ethernet message).  So, let's create a function to do all this.

```rust
use std::net::Ipv4Addr;

pub fn same_subnet(src: Ipv4Addr, dest: Ipv4Addr, subnet: String) -> bool {
    let subnet_parsed: Ipv4Addr = subnet.parse().unwrap();

    let src_network = ipv4_to_u32(src.octets()) & ipv4_to_u32(subnet_parsed.octets());
    let dest_network = ipv4_to_u32(dest.octets()) & ipv4_to_u32(subnet_parsed.octets());

    src_network == dest_network
}

// to_bits is nightly experimental on Ipv4Addr so we have to do it ourselves
fn ipv4_to_u32(octets: [u8; 4]) -> u32 {
    ((octets[0] as u32) << 24)
        | ((octets[1] as u32) << 16)
        | ((octets[2] as u32) << 8)
        | (octets[3] as u32)
}
```

<!-- more -->

So, part of IP routing is this network matching which the entire internet uses although there are many other details and specifics.  But for now, know that the answer to

> Are the IPs 192.168.0.1 and 192.168.0.42 on the same network?

Yes, they are both on the same network.  And we can see this behavior in a test.

```rust
#[test]
fn test_subnet_routing() {
    let src = Ipv4Addr::new(192, 168, 0, 1);
    let dest = Ipv4Addr::new(192, 168, 0, 2);
    let subnet = "255.255.0.0".to_owned();

    let result = same_subnet(src, dest, subnet);
    assert!(result);
}
```

Because they are both on the same network, it means we don't have to forward it to another IP device like a router.  We can just send it locally (which means the next part).


## ARP

IP is a protocol used for routing traffic over the internet and on local area networks.  Similarly, there is another protocol which discovers hosts on a local network called [ARP](https://en.wikipedia.org/wiki/Address_Resolution_Protocol).  It's job is to discover what MAC addresses go with what IPs.  When we send an IP message, that's not enough.  Remember in in [Part 1](/2024/05/05/a_network_in_rust_part_1/), we talked about how messages go up and down abstraction layers.  So ARP is sort of connecting Layer 3 and Layer 2 because it connects IP addresses and hardware addresses which (in wired networks) lead us to ports on a switch and eventually electrons on a wire.

Simulating a real ARP request would be complicated because it's usually built into the operating system or network stack.  For this simulation, we're going to hardcode responses like this.

```rust
// src/network/arp.rs
impl Arp {
    // Simulating a broadcast, not accurate or realistic
    // In a real scenario, this would involve network communication
    pub fn broadcast_arp_request(ip_address: IpAddr) -> Option<MacAddress> {
        match ip_address.to_string().as_str() {
            "192.168.0.1" => Some([0x11, 0x12, 0x13, 0x14, 0x15, 0x16]),
            "192.168.0.2" => Some([0x21, 0x22, 0x23, 0x24, 0x25, 0x26]),
            _ => None, // do nothing and like it
        }
    }
}
```

For the remainder of this simulation, we'll use a convention where box1 is all about the number 1.  It has an IP with 1 and MAC hexadecimal that starts with 1 and eventually it will be plugged into port 1 on a network switch we will build.  Eventually, we will observe success by seeing a real network message get passed and this convention will help with reading.  This will be shown in Part 3.

> box1 will have the IP address of 192.168.0.1 and the MAC of 11:12:13:14:15:16 <br>
> box2 will have the IP address of 192.168.0.2 and the MAC of 21:22:23:24:25:26

In a real network, the ARP request would be a real-time event and simulating this would involve threads and concurrency which is not the point of this practice.  So, ARP gives us a MAC address.  What we do next, is make an Ethernet message that uses this MAC address.


## Ethernet

The [etherparse](https://docs.rs/etherparse/latest/etherparse/) library has a packet builder which is very convenient but for this demonstration is unfortunately reversed in a particular way.  What we are trying to demonstrate is going through the layers in order of the OSI model.  But etherparse's library does not allow us to do this.

Just as an example, this is how etherparse lets you create an Ethernet packet (frame) using their `PacketBuilder`.

```rust
pub fn packet(src_mac: MacAddress, dest_mac: MacAddress, payload: &str) -> Vec<u8> {
let builder = PacketBuilder::ethernet2(src_mac, dest_mac)
    .ipv4([192, 168, 6, 10], [192, 168, 6, 20], 42)
    .icmpv4_echo_request(123, 456);
```

We are starting with an IP packet and trying to make an ethernet packet.  But etherparse doesn't let us split up these method chains.  So, unfortunately, we have to pass Vectors of bytes around.  Fortunately, this is more accurate to the real world.  Thinking of data flowing through the networking layers as binary is probably mostly accurate.

So, etherparse is reversed from what we want and coupled.  Etherparse does `::ethernet2().ipv4()` and we want `::ipv4().ethernet2()` basically.  And it's coupled because you can't break these apart.  It's just how Etherparse's library works.  In a real project, it wouldn't matter.  But for explaining the layers and learning, it's just unfortunate.


```rust
// src/network/ethernet.rs

use etherparse::Ethernet2Header;

pub fn build_ethernet(source: [u8; 6], destination: [u8; 6], payload: Vec<u8>) -> Vec<u8> {
    let mut buffer = Vec::<u8>::new();

    let header = Ethernet2Header {
        source,
        destination,
        ether_type: etherparse::EtherType::IPV4,
    };

    header
        .write(&mut buffer)
        .expect("Failed to write Ethernet frame");
    buffer.extend(payload);

    buffer
}
```

There is our ethernet message.  It's a Vector of bytes and etherparse handles the bit offsets for us.  Let's finally create a network interface that can contain an IP address and a MAC address and send this Ethernet message.


## An Interface

This is modeling a conceptual network interface.  As we saw in Part 1, commands like `ip addr` and `ifconfig` on Linux can show us network interface information.  But this is too much to implement.

```rust
// src/server/interface.rs
use crate::mac::{self, MacAddress};

#[derive(Clone)]
pub struct Interface {
    pub mac: MacAddress,
    pub ip: String,
    pub subnet_mask: String,
    pub gateway: Option<String>,
}

impl Interface {
    pub fn new(mac: &str, ip: String, subnet_mask: String, gateway: Option<String>) -> Interface {
        Interface {
            mac: mac::parse_mac_address(mac),
            ip,
            subnet_mask,
            gateway,
        }
    }
}
```


## A Preview of putting this together

In the next part, we'll finish up with a server, a switch and a `main.rs` that runs the entire thing.

So, for example when we are setting up `box1` in our `main.rs`, we can do this.

```rust
let box1_interface = server::interface::Interface::new(
    "11:12:13:14:15:16",
    "192.168.0.1".to_owned(),
    "255.255.0.0".to_owned(),
    None,
);
let mut box1 = Server::new("box1".to_owned(), box1_interface.clone());
```

And we will "plug it in" to a switch on Port 1 that we haven't created yet.

```rust
switch.plug_in_interface(1, &box1.interface);
```

See you in the next post.
