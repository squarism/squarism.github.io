---
title: "LVS HOW-TO"
description: "Building a Linux Virtual Server cluster in 2003 on RedHat 7.2: kickstart to build nodes, NAT on the director, a patched 2.2 kernel, and ipvsadm to balance HTTP. Compressed from the original guide."
date: 2003-03-19T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

**Update and Reflection.** The original version of this post was a 2,700 word step by step guide with every config file and command. Almost none of it applies to anything made after 2003, so it has been compressed to what I did and why. The specific versions were RedHat 7.2, kernel 2.2.19, ipvs 1.0.8, and ipchains.

I wanted a cluster of cheap Linux boxes behind one address so Apache could survive a machine dying, and I wanted adding a machine to be nearly zero effort. Three PCs nobody cared about, a hub, a KVM switch, and a few floppies.

What I remember from this time was getting kickstart to boot new nodes and join the cluster.  This learning also led to future clustering projects with different technology stacks.

<!-- more -->

## The shape of it

One director in front, two real servers behind it. The director had two NICs: one on the corporate LAN, one on a private 172.16 network for the real servers. The director ran DHCP with fixed reservations for the real servers by MAC address, and NAT so they could reach the internet without being on the company LAN. Requests hit a virtual IP on the director, and the kernel forwarded them to a real server.

## Building nodes with kickstart

Kickstart is the Linux equivalent of an unattended Windows install. A config file answers every question the RedHat installer asks. The director served the RedHat CDs over HTTP, since NFS as an install source kept erroring out, and served the kickstart configs over NFS. Each real server got its own config, identical apart from the hostname, with a crypted root password so the plain text was not sitting in a file.

Boot a node from a floppy made from `bootnet.img`, type one line at the boot prompt pointing at its config, walk away. That was the part that made the whole thing worthwhile. Bringing in a new PC meant writing down its MAC address, adding a DHCP reservation, copying a config, and booting it.

## The LVS part

LVS in 2003 meant patching the kernel. Download kernel 2.2.19 and the ipvs patch, apply it, enable masquerading virtual server support and the scheduling modules in the kernel config, and build. That was done on the director and on both real servers, which is where the NFS export of the software came in handy. Then the usual dance of copying the kernel into `/boot`, fixing symlinks, and editing lilo or grub.

With the kernel in place, the LVS configure script took a short config describing the virtual IP, the director's IP, and the service. Mine balanced HTTP with weighted least connections, one real server weighted 3 and the other 1 because the hardware was uneven. Running the generated script on the director set up the VIP as an interface alias and loaded the ipvsadm table. `ipvsadm -L` showed both real servers behind the VIP, masqueraded.

## Things that made it bearable

`screen` on the director with a window per real server, so I could stop using the KVM switch. SSH keys copied to each node so there were no passwords to type. Both are obvious now and were new to me then.

## What it got me

High availability in the sense that one real server could die and the site stayed up. The director was a single point of failure, which the original post admitted and never fixed. Old hardware got a job. Nothing proprietary was bought. And an early appreciation for automated installs, which turned out to be the durable lesson. The kernel patching is long gone. IPVS has been in mainline Linux for twenty years and the same idea now runs under Kubernetes.
