---
title: Infinite Maze API - Multi-segment Mazes

date: 2023-04-08
updated: 2023-04-08

authors:
- waf
---

# Infinite Maze API - Multi-segment Mazes

This document describes how to implement multi-segment generators (MGs) for the infinite maze.


## Middleware-to-MG request

When requesting a maze segment from an MG, the middleware will send data in the HTML packet about the location of the new segment and nearby free space in the maze. The data will be a JSON in this form:

```
{ 
    "main": [0, 0],
    "free": [-1, 0, 0, 1, 1, 0, 0, -1, ...]
}
```

- `"main"` will always map to a list of 2 integers, containing the row and column respectively of the segment that the MG **must** generate.
- `"free"` maps to a list of areas where maze segments have not been generated. Every 2 integers in the list are the row and column of a free space. In the example above, `(-1, 0)`, `(0, 1)`, `(1, 0)`, and `(0, -1)` are free. The MG **may** provide additional maze segments for these coordinates.
  - In the current server configuration, only free space within 10 rows and columns (a 21x21 area) will be sent.

In Flask, this data can be accessed with `request.json`.


## MG-to-Middleware response

The MG can respond with data for multiple segments in this format:

```
{
  "geom": [...],
  "extern": {
    "-1_0": { "geom": [...] },
    "0_1": { "geom": [...] }
  }
}
```

- `"geom"` maps to the main segment's geometry. This way, MGs that only return a single segment don't need to be adjusted.
- `"extern"` maps to a dictionary where the keys denote integer coordinates separated by `"_"`, and values contain maze data for each additional maze segment at those coordinates.

The MG does not have to provide a segment for *all* free spaces. In this example, `(1, 0)` and `(0, -1)` were also free but the MG did not choose to fill them in.