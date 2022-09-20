# Virtual Memory

**Virtual memory** is a technique employed by modern operating systems to abstract away physical memory from running processes, and allow processes to use auxiliary memory whenever main memory runs out. Here, we'll discuss how virtual works and why operating systems implement virtual memory.

## Overview

### How does virtual memory work?

Virtual memory provides the illusion to every process that it has uninhibited access to an open memory space that it does not share with any other processes. Any process that is launched on a computer with virtual memory is given its own **virtual address space**, a range of possible "virtual" memory addresses that process has access to. Nowadays, a virtual address space typically consists of 2<sup>64</sup> (roughly 18 exabytes of) although many older systems have spaces of 2<sup>32</sup> addresses.

The memory addresses in a process's virtual address space are not actually the same as the physical memory that exists on the machine itself. Instead, every virtual memory address is mapped to a physical address via the operating system. Whenever a process attempts to get or manipulate some virtual memory address, the operating system will instead translate that virtual address to a physical address (i.e. an address that actually exists on the main memory) and make changes to that memory address instead.

Virtual address spaces are typically divided into larger units called **pages** (more on those [here](../paging)). Each page is typically 4 KiB large, and each page is mapped to an equally sized unit of memory in physical memory. Mapping is tracked by a structure maintained within each process called a **page table**, which holds information about each page (i.e. if it is a shared page, if it is executable, etc.) and translates each page to a **page frame**, or the physical block of memory corresponding to the virtual page. 

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50%" height="50%" display="block" margin="auto" viewBox="-0.5 -0.5 712 532" content="&lt;mxfile host=&quot;app.diagrams.net&quot; modified=&quot;2022-08-15T18:38:55.290Z&quot; agent=&quot;5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36&quot; etag=&quot;ZbXo9RkH4u4zthnCXP9J&quot; version=&quot;20.1.1&quot;&gt;&lt;diagram id=&quot;Z00uC2SatL4r7QjCFoRb&quot; name=&quot;Page-1&quot;&gt;7Vvfk5o6FP5rfLwdIAT0cXW77cO9tzvXTrt9jBCBWSBOiFX3r7+JEBXIuqkLQqU64yQn4US+78uPc9ARmCXbTxStwn+Ij+ORZfjbEbgfWZYzcfinMOxygw3GuSGgkZ+bzKNhHr3gwmgU1nXk46zUkRESs2hVNnokTbHHSjZEKdmUuy1JXB51hQJcM8w9FNet3yOfhbl1DI2j/TOOglCObBpFS4Jk58KQhcgnmxMT+DgCM0oIy0vJdoZjgZ3EJb/u4ZXWwxejOGU6F/w7fbLCp9Cbj/+bfHrBLvq+Dv4qvPxE8bq44eLLsp1EgJJ16mPhxBiB6SaMGJ6vkCdaN5xybgtZEvOayYsZo+T5gBS/x2kxAKYMb1/95uYBD64jTBLM6I53kRe4BYSFhqxxUd8cGTElzOEpG7IjKlQQHHwfgeKFAqtfwM1S4ObEfNjpihcCUXgUyrIMUzbwcQ5ttwSy0xbGQBtj6zfFGNhdY2xrYwx+U4xto2uM4c2vFdDpGmPn5tcKx+oaY/fm1wqn8z3PVB3IKiB/u5vzHmTJPx4p8XCWaS8dHCpWxhXFUZDysschw5QbBKARP//eFQ1J5Pvi8inFWfSCFntXgrAViVK2v384HcF74WvNSJaf4I+UzUhM6H504OxfvGUZxfGJfQnFW9hJyk7s+aul442pSTVsjWr9M+TXPewieqEXkM4Dj5UoeusFfnuiLfJZ+ffiYEDec7Cfq1/WLI5SSa+P6PMX7iZiAlLjgwHLRmtvVc/dqgCW2PE8lWR8d7IwjGYkYFuwLAHVbJ9cNYwwJwoN9G6ZdJ3y3AFAc+6A1tZJOdq5yfNAUXK1U1VF0T7C46VS0Y43xotlx8S0x4vG/iV5ucpJrJOVpsbLpHNeNDYbyctVTm+9mC827JwXjSSH5MUeDC9Q93DWHi8aiRHJCxzMOgbdznnRSKZIXpzB8OJ0vu8DnWRtuMtEZMm7JTghYtQ/IetZlivxiirLZipYbi1kBfopoNdCVr1DX/9D1utsjNWQVZloHcO6BNoLWYEqZNXJUOkxP9zpXntwoRs0tDbd5dOpc9kJnPp34jG7IChGGV/gy+yVt9f8cuzXnrm/CdIJCPAMBhTHiEU/y+5VwBQjPAqJHDmwJmUOgFnBNiNr6uHiqiO8NUe29YYjhmiAWc3RnqfDbb+DOo0H+zdOndsUdVVHbVOnCtUHRZ1tN0RdzVHb1KlOwYOiDk4aoq7mqG3qVAH/oKhzqueIS6mrOWqbOlVOYFDUuU0dU2qO2qZO9buNd1HHCaK7p9PKD1H5AGX1fnvaeL8ratrhnWHYs+nDL4jEMnIQz8CQ33VXanLeWnp11eRUEhbw2tuvKj0xQDUZfVLTxduKCztW07hpNb3O/qU6a1I1oE+quXhHc6o/6aqmvNtWjcYvOt6pmumDOzPdnqim03NQVTUXp2uqqqk9KGlZNRKPoajG7pVqLs0UVVUDrCurpvEkX79VA/ukmouTVDXVNJbp4NXj38ny7sf/5IGP/wM=&lt;/diagram&gt;&lt;/mxfile&gt;"><defs/><g><rect x="1" y="70" width="120" height="180" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="2" pointer-events="all"/><rect x="1" y="70" width="120" height="60" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 100px; margin-left: 2px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Page 1</p></div></div></div></foreignObject><text x="61" y="104" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Page 1</text></switch></g><rect x="1" y="130" width="120" height="60" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 160px; margin-left: 2px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Page 2</p></div></div></div></foreignObject><text x="61" y="164" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Page 2</text></switch></g><rect x="1" y="190" width="120" height="60" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 220px; margin-left: 2px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Page 3</p></div></div></div></foreignObject><text x="61" y="224" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Page 3</text></switch></g><rect x="1" y="350" width="120" height="60" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 380px; margin-left: 2px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Page 1</p></div></div></div></foreignObject><text x="61" y="384" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Page 1</text></switch></g><rect x="1" y="410" width="120" height="60" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 440px; margin-left: 2px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Page 2</p></div></div></div></foreignObject><text x="61" y="444" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Page 2</text></switch></g><rect x="1" y="470" width="120" height="60" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 500px; margin-left: 2px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Page 3</p></div></div></div></foreignObject><text x="61" y="504" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Page 3</text></switch></g><rect x="1" y="0" width="120" height="50" fill="#f5f5f5" stroke="#666666" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 25px; margin-left: 61px;"><div data-drawio-colors="color: #333333; " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(51, 51, 51); line-height: 1.2; pointer-events: all; white-space: nowrap;"><p>VAS of Process 1</p></div></div></div></foreignObject><text x="61" y="29" fill="#333333" font-family="Helvetica" font-size="12px" text-anchor="middle">VAS of Process 1</text></switch></g><path d="M 256 70 L 426 70 L 446 90 L 446 250 L 276 250 L 256 230 L 256 70 Z" fill="#ffe6cc" stroke="#d79b00" stroke-width="2" stroke-miterlimit="10" pointer-events="all"/><path d="M 256 70 L 426 70 L 446 90 L 276 90 Z" fill-opacity="0.05" fill="#000000" stroke="none" pointer-events="all"/><path d="M 256 70 L 276 90 L 276 250 L 256 230 Z" fill-opacity="0.1" fill="#000000" stroke="none" pointer-events="all"/><path d="M 276 250 L 276 90 L 256 70 M 276 90 L 446 90" fill="none" stroke="#d79b00" stroke-width="2" stroke-miterlimit="10" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 168px; height: 1px; padding-top: 170px; margin-left: 277px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Page Table for Process 1</p></div></div></div></foreignObject><text x="361" y="174" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Page Table for Process 1</text></switch></g><rect x="591" y="120" width="120" height="360" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="2" pointer-events="all"/><rect x="591" y="120" width="120" height="60" fill="#dae8fc" stroke="#6c8ebf" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 150px; margin-left: 592px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Frame 1</p></div></div></div></foreignObject><text x="651" y="154" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Frame 1</text></switch></g><rect x="591" y="180" width="120" height="60" fill="#ffe6cc" stroke="#d79b00" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 210px; margin-left: 592px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Frame 2</p></div></div></div></foreignObject><text x="651" y="214" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Frame 2</text></switch></g><rect x="591" y="240" width="120" height="60" fill="#dae8fc" stroke="#6c8ebf" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 270px; margin-left: 592px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Frame 3</p></div></div></div></foreignObject><text x="651" y="274" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Frame 3</text></switch></g><rect x="591" y="300" width="120" height="60" fill="#dae8fc" stroke="#6c8ebf" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 330px; margin-left: 592px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Frame 4</p></div></div></div></foreignObject><text x="651" y="334" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Frame 4</text></switch></g><rect x="591" y="360" width="120" height="60" fill="#ffe6cc" stroke="#d79b00" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 390px; margin-left: 592px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Frame 5</p></div></div></div></foreignObject><text x="651" y="394" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Frame 5</text></switch></g><rect x="591" y="420" width="120" height="60" fill="#ffe6cc" stroke="#d79b00" stroke-width="2" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 450px; margin-left: 592px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Frame 6</p></div></div></div></foreignObject><text x="651" y="454" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Frame 6</text></switch></g><rect x="596" y="50" width="110" height="50" fill="#f5f5f5" stroke="#666666" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 75px; margin-left: 651px;"><div data-drawio-colors="color: #333333; " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(51, 51, 51); line-height: 1.2; pointer-events: all; white-space: nowrap;"><p>Physical memory</p></div></div></div></foreignObject><text x="651" y="79" fill="#333333" font-family="Helvetica" font-size="12px" text-anchor="middle">Physical memory</text></switch></g><path d="M 256 350 L 421 350 L 441 370 L 441 530 L 276 530 L 256 510 L 256 350 Z" fill="#dae8fc" stroke="#6c8ebf" stroke-width="2" stroke-miterlimit="10" pointer-events="all"/><path d="M 256 350 L 421 350 L 441 370 L 276 370 Z" fill-opacity="0.05" fill="#000000" stroke="none" pointer-events="all"/><path d="M 256 350 L 276 370 L 276 530 L 256 510 Z" fill-opacity="0.1" fill="#000000" stroke="none" pointer-events="all"/><path d="M 276 530 L 276 370 L 256 350 M 276 370 L 441 370" fill="none" stroke="#6c8ebf" stroke-width="2" stroke-miterlimit="10" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 163px; height: 1px; padding-top: 450px; margin-left: 277px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><p>Page Table for Process 2</p></div></div></div></foreignObject><text x="359" y="454" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Page Table for Process 2</text></switch></g><rect x="1" y="280" width="120" height="50" fill="#f5f5f5" stroke="#666666" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 305px; margin-left: 61px;"><div data-drawio-colors="color: #333333; " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(51, 51, 51); line-height: 1.2; pointer-events: all; white-space: nowrap;"><p>VAS of Process 2</p></div></div></div></foreignObject><text x="61" y="309" fill="#333333" font-family="Helvetica" font-size="12px" text-anchor="middle">VAS of Process 2</text></switch></g><path d="M 121 100 L 244.63 100" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 249.88 100 L 242.88 103.5 L 244.63 100 L 242.88 96.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><path d="M 121 160 L 244.63 160" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 249.88 160 L 242.88 163.5 L 244.63 160 L 242.88 156.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><path d="M 121 230 L 244.63 230" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 249.88 230 L 242.88 233.5 L 244.63 230 L 242.88 226.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><path d="M 121 380 L 244.63 380" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 249.88 380 L 242.88 383.5 L 244.63 380 L 242.88 376.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><path d="M 121 440 L 244.63 440" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 249.88 440 L 242.88 443.5 L 244.63 440 L 242.88 436.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><path d="M 121 500 L 244.63 500" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 249.88 500 L 242.88 503.5 L 244.63 500 L 242.88 496.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><path d="M 451 380 L 585.99 273.93" fill="none" stroke="#004cbf" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 590.12 270.69 L 586.78 277.77 L 585.99 273.93 L 582.45 272.26 Z" fill="#004cbf" stroke="#004cbf" stroke-miterlimit="10" pointer-events="all"/><path d="M 451 440 L 588.23 155.73" fill="none" stroke="#004cbf" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 590.51 151.01 L 590.62 158.83 L 588.23 155.73 L 584.32 155.79 Z" fill="#004cbf" stroke="#004cbf" stroke-miterlimit="10" pointer-events="all"/><path d="M 451 500 L 586.95 334.92" fill="none" stroke="#004cbf" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 590.29 330.86 L 588.54 338.49 L 586.95 334.92 L 583.14 334.04 Z" fill="#004cbf" stroke="#004cbf" stroke-miterlimit="10" pointer-events="all"/><path d="M 451 100 L 585.99 206.07" fill="none" stroke="#bf7c17" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 590.12 209.31 L 582.45 207.74 L 585.99 206.07 L 586.78 202.23 Z" fill="#bf7c17" stroke="#bf7c17" stroke-miterlimit="10" pointer-events="all"/><path d="M 451 160 L 587.69 384.56" fill="none" stroke="#bf7c17" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 590.42 389.05 L 583.79 384.89 L 587.69 384.56 L 589.77 381.25 Z" fill="#bf7c17" stroke="#bf7c17" stroke-miterlimit="10" pointer-events="all"/><path d="M 451 230 L 587.58 444.63" fill="none" stroke="#bf7c17" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 590.4 449.06 L 583.69 445.03 L 587.58 444.63 L 589.59 441.27 Z" fill="#bf7c17" stroke="#bf7c17" stroke-miterlimit="10" pointer-events="all"/></g><switch><g requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"/><a transform="translate(0,-5)" xlink:href="https://www.diagrams.net/doc/faq/svg-export-text-problems" target="_blank"><text text-anchor="middle" font-size="10px" x="50%" y="100%">Text is not SVG - cannot display</text></a></switch></svg>

### Memory mappings and MMUs

Virtual addresses are translated to physical addresses through the use of a processor's **main memory unit** (MMU). To make memory translation efficient, the MMU is also equipped with a **translation lookaside buffer** (TLB), which functions as a cache that holds the most recent memory translations. The TLB serves as the hardware's way of making mappings significantly faster (since it can return translations immediately from its cache), taking advantage of **locality of reference**, the idea that programs tend to access the same region of memory many times over a short period. To successfully return a physical memory address, an operating system typically goes through a process similar to this:

1. Check the translation lookaside buffer to see if the virtual address has recently been translated. If it has, return the physical address for that translation immediately.
2. If not, check to see if there is an entry for the page in the process's page table. If the page exists in main memory, return the translation corresponding to that entry and update the TLB. 
3. If the page is not in main memory, read the memory from auxiliary memory if there is enough main memory to accomodate the new page and add a mapping for the page to the page table.
4. If there is not enough memory to accomodate a new mapping, perform [page replacement](../paging) to move the queried page into main memory.

### Why virtualize memory?

The chief concern with virtual memory is that it can make the machine significantly slower by making memory access more computationally expensive. However, the implementation of hardware support (i.e. MMUs, TLBs) for virtual memory has made it fast enough to allow its benefits to outway the expense. Nowadays, virtual memory is implemented in most modern operating systems, and virtual memory has a number of important advantages that make it worth using:
- **Memory safety over multiple programs:** Many executable binaries in compiled languages create data in fixed memory addresses, meaning that if two programs were to allocate directly into physical memory but create data in the same memory addresses, one process could overwrite the other. In a system implementing virtual memory, every address is part of the virtual address space of that process, making overlap impossible.
- **Virtual memory allows use of auxiliary memory for programs:** The physical memory that each virtual address maps to is not required to specifically be RAM or main memory. In the event that the amount of main memory consumed on the system exceeds capacity, the operating system can set memory pages to point to auxiliary memory (i.e. a hard-drive disk) instead. In practice, this greatly expands the available memory that every program on the system has access to, regardless of accessing that memory is slow.
- **Security:** Because virtual memory not guaranteed to be contiguous in its mapping to physical memory, it is impossible for programs to be able to meaningfully manipulate the memory around it. Additionally, virtual memory gives the operating system an easy way to check which process owns which memory, and assign permissions (read, write, execute) to every memory page.

## Further reading

From the Systems Encylopedia:
- [Processes](../processes)
- [Paging](../paging)
- [Memory organization](memory-organization)