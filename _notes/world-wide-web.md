---
status: 🌱
---

https://www.w3.org/Proposal.html

# WorldWideWeb: Proposal for a HyperText Project
From:
T. Berners-Lee/CN, R. Cailliau/ECP
Date:
12 November 1990

![Screen Shot 2021-04-11 at 10 25 41 AM](https://user-images.githubusercontent.com/227587/114308013-52435c80-9ab0-11eb-9a1d-fa4814a542a9.png)

## Abstract
HyperText is a way to link and access information of various kinds as a web of nodes in which the user can browse at will. Potentially, HyperText provides a single user-interface to many large classes of stored information such as reports, notes, data-bases, computer documentation and on-line systems help. We propose the implementation of a simple scheme to incorporate several different servers of machine-stored information already available at CERN, including an analysis of the requirements for information access needs by experiments.

## Hypertext concepts
The principles of hypertext, and their applicability to the CERN environment, are discussed more fully in, a glossary of technical terms is given in. Here we give a short presentation of hypertext.
A program which provides access to the hypertext world we call a browser. When starting a hypertext browser on your workstation, you will first be presented with a hypertext page which is personal to you : your personal notes, if you like. A hypertext page has pieces of text which refer to other texts. Such references are highlighted and can be selected with a mouse (on dumb terminals, they would appear in a numbered list and selection would be done by entering a number). When you select a reference, the browser presents you with the text which is referenced: you have made the browser follow a hypertext link :

(see Fig. 1: hypertext links).

That text itself has links to other texts and so on. In fig. 1, clicking on the GHI would take you to the minutes of that meeting. There you would get interested in the discussion of the UPS, and click on the highlighted word UPS to find out more about it.

The texts are linked together in a way that one can go from one concept to another to find the information one wants. The network of links is called a web . The web need not be hierarchical, and therefore it is not necessary to "climb up a tree" all the way again before you can go down to a different but related subject. The web is also not complete, since it is hard to imagine that all the possible links would be put in by authors. Yet a small number of links is usually sufficient for getting from anywhere to anywhere else in a small number of hops.

The texts are known as nodes. The process of proceeding from node to node is called navigation . Nodes do not need to be on the same machine: links may point across machine boundaries. Having a world wide web implies some solutions must be found for problems such as different access protocols and different node content formats. These issues are addressed by our proposal.

Nodes can in principle also contain non-text information such as diagrams, pictures, sound, animation etc. The term hypermedia is simply the expansion of the hypertext idea to these other media. Where facilities already exist, we aim to allow graphics interchange, but in this project, we concentrate on the universal readership for text, rather than on graphics.

## Applications
The application of a universal hypertext system, once in place, will cover many areas such as document registration, on-line help, project documentation, news schemes and so on. It would be inappropriate for us (rather than those responsible) to suggest specific areas, but experiment online help, accelerator online help, assistance for computer center operators, and the dissemination of information by central services such as the user office and CN and ECP divisions are obvious candidates. WorldWideWeb (or W3 ) intends to cater for these services across the HEP community.
