command="tensorboard --port 6006 --logdir="
for FILE in keep_rate*
do
  command="${command}${FILE}:./${FILE},"
done
# remove the last comma
command=${command%?}
echo $command
eval $command
