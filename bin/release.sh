#! /bin/bash
#
# Script to deploy from Github to WordPress.org Plugin Repository
#
# Inspired by https://github.com/benbalter/Github-to-WordPress-Plugin-Directory-Deployment-Script
# https://github.com/deanc/wordpress-plugin-git-svn
# https://github.com/thenbrent/multisite-user-management/blob/master/deploy.sh

PLUGINSLUG='advanced-image-styles'
SVNUSER='gcorne' # your svn username
GITREMOTE='github'

# main config, set off of plugin slug
PLUGINPATH=`pwd`
MAINFILE="$PLUGINSLUG.php" # this should be the name of your main php file in the wordpress plugin

# svn config
SVNPATH="/tmp/$PLUGINSLUG" # path to a temp SVN repo. No trailing slash required and don't add trunk.
SVNURL="http://plugins.svn.wordpress.org/$PLUGINSLUG/" # Remote SVN repo on WordPress.org, with no trailing slash

# Let's begin...
echo "Preparing to deploy WordPress plugin..."
echo

if [ ! -f $PLUGINPATH/$MAINFILE ]; then
	echo "[Fatal] Script Must be run from a valid git clone of $PLUGINSLUG from the root directory"
	echo
	exit;
fi

# Check version in readme.txt is the same as plugin file
NEWVERSION1=`grep "^Stable tag" $PLUGINPATH/readme.txt | awk -F' ' '{print $3}'`
echo "readme version: $NEWVERSION1"
NEWVERSION2=`grep "^ \* Version" $PLUGINPATH/$MAINFILE | awk -F' ' '{print $3}'`
echo "$MAINFILE version: $NEWVERSION2"

if [ "$NEWVERSION1" != "$NEWVERSION2" ]; then echo "Versions don't match. Exiting...."; exit 1; fi

echo "Versions match in readme.txt and PHP file. Let's proceed..."

echo "Tagging new version in git"
git tag -a "$NEWVERSION1" -m "Version $NEWVERSION1"

echo "Pushing latest commit to git remote, with tags"
git push $GITREMOTE master
git push $GITREMOTE master --tags

echo 
echo "Creating local copy of SVN repo..."
svn co $SVNURL $SVNPATH

echo "Ignoring github specific files and deployment script"
svn propset svn:ignore "README.md
bin
.git
.gitignore" "$SVNPATH/trunk/"

#export git -> SVN
echo "Exporting the HEAD of master from git to the trunk of SVN"
git checkout-index -a -f --prefix=$SVNPATH/trunk/

echo "Changing directory to SVN and committing to trunk"
cd $SVNPATH/trunk/
# Add all new files that are not set to be ignored
svn status | grep -v "^.[ \t]*\..*" | grep "^?" | awk '{print $2}' | xargs svn add

svn commit --username=$SVNUSER -m "Version $NEWVERSION1"

echo "Creating new SVN tag & committing it"
svn copy --username=$SVNUSER -m "Tag version $NEWVERSION1" $SVNURL/trunk $SVNURL/tags/$NEWVERSION1

echo "Removing temporary directory $SVNPATH"
rm -fr $SVNPATH/

echo "*** FINISHED ***"

