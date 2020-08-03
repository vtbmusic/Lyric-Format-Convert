# Lyric-Format-Convert
Provide supports for multiple lyric format conversions. This repository will be long-time supported.

Former repository (no longer be supported): [VTB-Music-Lyric-Converter](https://github.com/vtbmusic/VTB-Music-Lyric-Converter)

Related repository: [VRCMaker](https://github.com/vtbmusic/VRCMaker)

Currently supporting language:

+ Python
+ JavaScript

### Python Script for Manual Convertion
`convert.py`, Usage:

```shell
usage: convert.py [-h] [-r] -f {txt,mlrc,ass} [--indent INDENT] path

VtuberMusic Lyric-Format-Converter

positional arguments:
  path               Path to the file. A new .vrc file will be created. Add -r
                     if you want to convert all files under a directory.

optional arguments:
  -h, --help         show this help message and exit
  -r                 Recursively convert all files under the directory.
  -f {txt,mlrc,ass}  The origin format of the file. Acceptable values are
                     txt/mlrc/ass
  --indent INDENT    Indent of the JSON-format text.
```