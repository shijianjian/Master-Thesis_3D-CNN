command="tensorboard --port 6005 --logdir="
for FILE in keep_rate*
do
  command="${command}${FILE}:./${FILE},"
done
# remove the last comma
command=${command%?}
echo $command
eval $command
