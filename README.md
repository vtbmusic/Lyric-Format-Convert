# Lyric-Format-Convert
Provide supports for multiple lyric format conversions. This repository will be long-time supported.

Former repository (no longer be supported): [VTB-Music-Lyric-Converter](https://github.com/vtbmusic/VTB-Music-Lyric-Converter)

Related repository: [VRCMaker](https://github.com/vtbmusic/VRCMaker)

Currently supporting language:

+ Python
+ JavaScript

### Python Script for Manual Convertion
`convert.py`, Usage:

```
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

中文说明：

+ 命令行参数：
  + `path`: 必须，文件路径或者文件夹路径。
  + `-r`: 可选，开启递归模式，如果 `path` 填写文件夹路径请加上此参数。递归模式会在目标文件夹及其所有子文件夹内寻找指定后缀的文件并尝试进行转换。
  + `-f`: 必须，指定原格式。可选值为 txt/mlrc/ass。其中 txt 和 mlrc 都是指原先的“一轴双语 lrc“格式，递归模式下查找的后缀名是 ".txt"。ass 指 ass 轴文件格式，递归模式下查找的后缀名是 ".ass"。另外还有一些特别注意，在下面说明。
  + `--indent`: 可选，指定 JSON 文件的缩进，可以不管。
+ ass 轴文件的部分限制：
  + 要求日语和中文之间用 "\N" 分隔，且日语在中文之前。日语和中文各轴一遍的话，目前暂时不支持转换。要求一定要有中文，也就是一定要有 "\N"。
  + 满足以上要求后仍出现问题可以在这发 issue 或者组内联系。
+ 提示语句：
  + 如果对单文件进行转换，那么正常结束的标志就是命令行什么也不输出。转换完毕后，你会在同一个文件夹下发现一个文件名相同，后缀名为 ".vrc" 的文件。
  + 如果对文件夹进行递归转换，那么结束时会提示发现的总文件数、转换成功文件数、转换失败文件数。
+ 错误语句：如果尝试转换一个文件的过程中发生错误，会立刻输出错误语句。可能发生的错误有：
  + 编码错误。命令行提示 "Unrecognized encoding"。这意味着此文件不是标准的 utf-8、utf-16-le、或者 gbk 编码格式。出现此问题请发 issue 或组内联系。
  + 转换失败。此提示只会出现在转换 ass 格式轴文件时，且提示一般来说非常清晰，请根据提示检查文件内容。如果无法解决，请组内联系。
  + 其他错误。程序没能处理抛出的异常，直接崩溃退出。出现此问题请发 issue 或组内联系。
+ 使用示例：
  + 单文件模式：`python3 convert.py ~/Downloads/僕らの手には何もないけど-铃音.ass -f ass`
  + 递归模式：`python3 convert.py ~/Downloads -r -f ass`