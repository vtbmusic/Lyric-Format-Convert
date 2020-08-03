import os
import argparse
import json
import utils

parser = argparse.ArgumentParser(description='VtuberMusic Lyric-Format-Converter')
parser.add_argument(
    'path',
    type=str,
    help='Path to the file. A new .vrc file will be created. Add -r if you want to convert all files under a directory.'
)
parser.add_argument(
    '-r',
    action='store_true',
    default=False,
    help='Recursively convert all files under the directory.'
)
parser.add_argument(
    '-f',
    required=True,
    help='The origin format of the file. Acceptable values are txt/mlrc/ass',
    choices=['txt', 'mlrc', 'ass']
)
parser.add_argument(
    '--indent',
    type=int,
    default=2,
    help='Indent of the JSON-format text.'
)


def convert_dir(args):
    if args.f == 'txt' or args.f == 'mlrc':
        suffix = '.txt'
    elif args.f == 'ass':
        suffix = '.ass'
    
    lyric_files = []
    for root, dirs, files in os.walk(args.path):
        for name in files:
            if os.path.splitext(name)[1] == suffix:
                lyric_files.append(os.path.join(root, name))
    
    success = 0
    failed = 0
    for lyric_file in lyric_files:
        flag = convert_file(args, lyric_file)
        if flag:
            success += 1
        else:
            failed += 1
    
    print('{:d} file(s) were detected.\n{:d} file(s) were converted successfully.\n{:d} file(s) failed to be converted.'
        .format(len(lyric_files), success, failed))


def convert_file(args, file_path):
    decoded = False
    for enc in ['utf-8', 'utf-16-le', 'gbk']:
        try:
            with open(file_path, 'r', encoding=enc) as f:
                ori_txt = f.read()
            decoded = True
            break
        except UnicodeDecodeError:
            pass
    
    if not decoded:
        print('Unrecognized encoding in file: {}. Skip this file.'.format(file_path))
        return False
    
    try:
        if args.f == 'txt' or args.f == 'mlrc':
            vrc_obj = utils.mlrc2vrc(ori_txt)
        elif args.f == 'ass':
            vrc_obj = utils.ass2vrc(ori_txt)
    except utils.ConvertError as err:
        print('In file {}: {}'.format(file_path, err))
        return False
    
    new_file = os.path.splitext(file_path)[0] + '.vrc'
    with open(new_file, 'w', encoding='utf-8') as f:
        json.dump(vrc_obj, f, ensure_ascii=False, indent=args.indent)
    
    return True


if __name__ == '__main__':
    args = parser.parse_args()
    if args.r:
        convert_dir(args)
    else:
        convert_file(args, args.path)